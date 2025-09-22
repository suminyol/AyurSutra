const Patient = require('../models/Patient').default;
const User = require('../models/User').default;
const { authenticate, authorize } = require('../middleware/auth');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Doctor/Admin
const getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name or email
    if (req.query.search) {
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.user = { $in: users.map(u => u._id) };
    }

    // Filter by dosha
    if (req.query.dosha) {
      query['prakritiAssessment.dominantDosha'] = req.query.dosha;
    }

    const patients = await Patient.find(query)
      .populate('user', 'name email phone dateOfBirth gender')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
  }
};

// Add this method to your patientController.js

// @desc    Get patients by doctor (patients who have appointments with this doctor)
// @route   GET /api/patients/doctor/:doctorId
// @access  Private/Doctor/Admin
const getPatientsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all appointments for this doctor to get patient IDs
    const Appointment = require('../models/Appointment').default;
    const appointments = await Appointment.find({ doctor: doctorId }).distinct('patient');

    if (appointments.length === 0) {
      return res.json({
        success: true,
        data: {
          patients: [],
          pagination: {
            current: page,
            pages: 0,
            total: 0
          }
        }
      });
    }

    const query = { _id: { $in: appointments } };

    // Add search functionality
    if (req.query.search) {
      const users = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.user = { $in: users.map(u => u._id) };
      query._id = { $in: appointments }; // Keep the doctor filter
    }

    const patients = await Patient.find(query)
      .populate('user', 'name email phone dateOfBirth gender')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get patients by doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor patients'
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email phone dateOfBirth gender')
      .populate('currentTreatments')
      .populate('completedTreatments');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient'
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const { medicalHistory, allergies, medications, emergencyContact, preferences, prakritiAssessment } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update fields
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (allergies) patient.allergies = allergies;
    if (medications) patient.medications = medications;
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (preferences) patient.preferences = preferences;
    if (prakritiAssessment) patient.prakritiAssessment = prakritiAssessment;

    await patient.save();

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient'
    });
  }
};

// @desc    Get patient medical history
// @route   GET /api/patients/:id/medical-history
// @access  Private
const getMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: {
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        medications: patient.medications
      }
    });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medical history'
    });
  }
};

// @desc    Add medical history entry
// @route   POST /api/patients/:id/medical-history
// @access  Private/Doctor
const addMedicalHistory = async (req, res) => {
  try {
    const { condition, diagnosisDate, treatment, status, notes } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.addMedicalHistory(condition, diagnosisDate, treatment, status, notes);

    res.json({
      success: true,
      message: 'Medical history added successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Add medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add medical history'
    });
  }
};

// @desc    Get patient treatments
// @route   GET /api/patients/:id/treatments
// @access  Private
const getPatientTreatments = async (req, res) => {
  try {
    const Treatment = require('../models/Treatment').default;
    
    const treatments = await Treatment.find({ patient: req.params.id })
      .populate('doctor', 'user')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { treatments }
    });
  } catch (error) {
    console.error('Get patient treatments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient treatments'
    });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/:id/appointments
// @access  Private
const getPatientAppointments = async (req, res) => {
  try {
    const Appointment = require('../models/Appointment').default;
    
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'user')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient appointments'
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  updatePatient,
  getMedicalHistory,
  addMedicalHistory,
  getPatientTreatments,
  getPatientAppointments,
  getPatientsByDoctor
};
