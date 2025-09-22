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
    // 1. Find the Doctor profile for the currently logged-in user
    const Doctor = require('../models/Doctor').default;
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found for this user.' });
    }

    // 2. Find all appointments for THIS doctor to get their unique patient IDs
    const Appointment = require('../models/Appointment').default;
    const patientIds = await Appointment.find({ doctor: doctor._id }).distinct('patient');

    if (patientIds.length === 0) {
      return res.json({ success: true, data: { patients: [] } });
    }

    // 3. Find all patient profiles that match those IDs
    const patients = await Patient.find({ _id: { $in: patientIds } })
      .populate('user', 'name email phone');

    res.json({ success: true, data: { patients } });

  } catch (error) {
    console.error('Get patients by doctor error:', error);
    res.status(500).json({ message: 'Failed to fetch doctor patients' });
  }
};

// @desc    A doctor adds a new patient or links an existing one
// @route   POST /api/patients/add-by-doctor
// @access  Private/Doctor

const addOrLinkPatient = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;
    
    const Doctor = require('../models/Doctor').default;
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    let patientUser;
    let patientProfile;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role !== 'patient') {
        return res.status(400).json({ message: 'This email is associated with a non-patient account.' });
      }
      patientUser = existingUser;
      patientProfile = await Patient.findOne({ user: patientUser._id });
      if (!patientProfile) {
        return res.status(404).json({ message: 'An account with this email exists, but their patient profile is missing.' });
      }
      // toast.success('Existing patient found.'); // <-- REMOVED THIS LINE
    } else {
      patientUser = await User.create({
        name, email, password, phone, dateOfBirth, gender, role: 'patient'
      });
      patientProfile = await Patient.create({ user: patientUser._id });
      // toast.success('New patient created successfully.'); // <-- REMOVED THIS LINE
    }

    const Appointment = require('../models/Appointment').default;
    const existingLink = await Appointment.findOne({ doctor: doctor._id, patient: patientProfile._id });

    if (!existingLink) {
      await Appointment.create({
        doctor: doctor._id,
        patient: patientProfile._id,
        date: new Date(),
        time: 'N/A',
        reason: 'Initial Consultation added by Doctor ' + req.user.name,
        type: 'consultation',
        status: 'completed',
        payment: { amount: 0, status: 'paid' }
      });
    }

    await patientProfile.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Patient successfully linked to your profile.',
      data: { patient: patientProfile }
    });

  } catch (error) {
    console.error('Add or Link Patient Error:', error);
    res.status(500).json({ message: 'An error occurred while adding the patient.' });
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
  addOrLinkPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  getMedicalHistory,
  addMedicalHistory,
  getPatientTreatments,
  getPatientAppointments,
  getPatientsByDoctor
};
