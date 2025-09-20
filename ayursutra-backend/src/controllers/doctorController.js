const Doctor = require('../models/Doctor').default;
const User = require('../models/User').default;
const { authenticate, authorize } = require('../middleware/auth');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isActive: true, isVerified: true };

    // Filter by specialization
    if (req.query.specialization) {
      query.specialization = req.query.specialization;
    }

    // Filter by city
    if (req.query.city) {
      query['clinic.city'] = new RegExp(req.query.city, 'i');
    }

    // Search by name
    if (req.query.search) {
      const users = await User.find({
        name: { $regex: req.query.search, $options: 'i' }
      }).select('_id');
      
      query.user = { $in: users.map(u => u._id) };
    }

    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('patients', 'user')
      .populate('reviews.patient', 'user');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor'
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor
const updateDoctor = async (req, res) => {
  try {
    const { 
      licenseNumber, 
      specialization, 
      qualifications, 
      experience, 
      consultationFee, 
      clinic, 
      services, 
      languages 
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update fields
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (clinic) doctor.clinic = clinic;
    if (services) doctor.services = services;
    if (languages) doctor.languages = languages;

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile'
    });
  }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: {
        availability: doctor.availability,
        consultationFee: doctor.consultationFee
      }
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor availability'
    });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private/Doctor
const updateDoctorAvailability = async (req, res) => {
  try {
    const { availability, consultationFee } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (availability) doctor.availability = availability;
    if (consultationFee) doctor.consultationFee = consultationFee;

    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor availability updated successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Update doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor availability'
    });
  }
};

// @desc    Get doctor patients
// @route   GET /api/doctors/:id/patients
// @access  Private/Doctor
const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'patients',
        populate: {
          path: 'user',
          select: 'name email phone dateOfBirth gender'
        }
      });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: {
        patients: doctor.patients,
        totalPatients: doctor.totalPatients
      }
    });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor patients'
    });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctors/:id/appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const Appointment = require('../models/Appointment').default;
    
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate('patient', 'user')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments'
    });
  }
};

// @desc    Get doctor reviews
// @route   GET /api/doctors/:id/reviews
// @access  Public
const getDoctorReviews = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('reviews.patient', 'user');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: {
        reviews: doctor.reviews,
        rating: doctor.rating
      }
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor reviews'
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorPatients,
  getDoctorAppointments,
  getDoctorReviews
};
