const Treatment = require('../models/Treatment').default;
const Appointment = require('../models/Appointment').default;
const Patient = require('../models/Patient').default;
const Doctor = require('../models/Doctor').default;
const { authenticate, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification').default; // 👈 Import Notification model
const notificationDispatcher = require('../services/notificationDispatcher'); // 👈 Import dispatcher

// @desc    Generate AI treatment plan
// @route   POST /api/treatments/generate-ai-plan
// @access  Private/Doctor
const generateAITreatmentPlan = async (req, res) => {
  try {
    const { patientId, appointmentId, symptoms, diagnosis, patientHistory } = req.body;

    // Verify appointment exists and belongs to doctor
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient doctor');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get patient's prakriti assessment
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Prepare data for AI service
    const aiRequestData = {
      symptoms,
      diagnosis,
      patientHistory,
      prakriti: patient.prakritiAssessment,
      age: patient.age,
      gender: patient.user.gender,
      medicalHistory: patient.medicalHistory,
      allergies: patient.allergies,
      currentMedications: patient.medications
    };

    // Call AI service (mock implementation)
    const aiResponse = await callAIService(aiRequestData);

    res.json({
      success: true,
      message: 'AI treatment plan generated successfully',
      data: {
        aiPlan: aiResponse,
        patient: {
          id: patient._id,
          name: patient.user.name,
          prakriti: patient.prakritiAssessment
        }
      }
    });
  } catch (error) {
    console.error('Generate AI treatment plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI treatment plan'
    });
  }
};

// @desc    Create treatment with AI plan
// @route   POST /api/treatments
// @access  Private/Doctor
const createTreatment = async (req, res) => {
  try {
    const { patientId, appointmentId, diagnosis, aiPlan, doctorCustomizations } = req.body;

    const appointment = await Appointment.findById(appointmentId)
        .populate({ path: 'doctor', populate: 'user' })
        .populate({ path: 'patient', populate: 'user' });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const existingTreatment = await Treatment.findOne({ appointment: appointmentId });
    if (existingTreatment) {
      return res.status(400).json({ success: false, message: 'Treatment already exists for this appointment' });
    }

    const treatment = new Treatment({
      patient: patientId,
      doctor: appointment.doctor._id,
      appointment: appointmentId,
      diagnosis: {
        primary: diagnosis.primary,
        secondary: diagnosis.secondary || [],
        symptoms: diagnosis.symptoms || [],
        notes: diagnosis.notes
      }
    });

    if (aiPlan) {
      treatment.aiGeneratedPlan = {
        isGenerated: true,
        generatedAt: new Date(),
        stages: aiPlan.stages,
        overallDuration: aiPlan.overallDuration,
        estimatedCost: aiPlan.estimatedCost,
        successRate: aiPlan.successRate,
        confidence: aiPlan.confidence
      };
    }

    if (doctorCustomizations) {
      await treatment.customizePlan(doctorCustomizations, appointment.doctor._id);
    }

    await treatment.save();

    // --- 👇 NEW NOTIFICATION LOGIC ---
    const patientUser = appointment.patient.user;
    const doctorUser = appointment.doctor.user;

    // 1. Prepare data for notification templates
    const notificationData = {
        doctorName: doctorUser.name,
        patientName: patientUser.name,
        treatmentId: treatment._id,
        link: `/treatments/${treatment._id}`,
        // You can add more data here for the templates, e.g.,
        // duration: treatment.customizedPlan.overallDuration.value,
        // cost: treatment.customizedPlan.estimatedCost
    };

    // 2. Create the notification record for the patient
    const patientNotification = await Notification.create({
        user: patientUser._id,
        type: 'treatment_plan', // This type must match a template in your email/sms services
        title: 'Your Treatment Plan is Ready',
        message: `Your personalized treatment plan from Dr. ${doctorUser.name} has been created.`,
        data: notificationData,
        link: notificationData.link,
        deliveryMethod: ['in_app', 'email'] // Example: In-app and Email, no SMS
    });

    // 3. Dispatch the notification to external channels (email, sms)
    notificationDispatcher.dispatchNotification(patientNotification);
    // --- END NOTIFICATION LOGIC ---

    const populatedTreatment = await Treatment.findById(treatment._id).populate([
      { path: 'patient', populate: { path: 'user', select: 'name email phone' } },
      { path: 'doctor', populate: { path: 'user', select: 'name email phone' } },
      { path: 'appointment' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Treatment created successfully',
      data: { treatment: populatedTreatment }
    });
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create treatment'
    });
  }
};
// @desc    Get all treatments
// @route   GET /api/treatments
// @access  Private
const getTreatments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by user role
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) {
        query.patient = patient._id;
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) {
        query.doctor = doctor._id;
      }
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by stage
    if (req.query.stage !== undefined) {
      query['currentStage.index'] = parseInt(req.query.stage);
    }

    const treatments = await Treatment.find(query)
      .populate([
        { path: 'patient', populate: { path: 'user', select: 'name email phone' } },
        { path: 'doctor', populate: { path: 'user', select: 'name email phone' } },
        { path: 'appointment' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Treatment.countDocuments(query);

    res.json({
      success: true,
      data: {
        treatments,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch treatments'
    });
  }
};

// @desc    Get treatment by ID
// @route   GET /api/treatments/:id
// @access  Private
const getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate([
        { path: 'patient', populate: { path: 'user', select: 'name email phone' } },
        { path: 'doctor', populate: { path: 'user', select: 'name email phone' } },
        { path: 'appointment' }
      ]);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (treatment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (treatment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: { treatment }
    });
  } catch (error) {
    console.error('Get treatment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch treatment'
    });
  }
};

// @desc    Start treatment
// @route   PUT /api/treatments/:id/start
// @access  Private/Doctor
const startTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check if user is the doctor for this treatment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (treatment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (treatment.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Treatment can only be started from draft status'
      });
    }

    // Start treatment
    await treatment.start();

    res.json({
      success: true,
      message: 'Treatment started successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Start treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start treatment'
    });
  }
};

// @desc    Complete treatment stage
// @route   PUT /api/treatments/:id/complete-stage
// @access  Private/Doctor
const completeTreatmentStage = async (req, res) => {
  try {
    const { stageIndex, notes } = req.body;

    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check if user is the doctor for this treatment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (treatment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Complete stage
    await treatment.completeStage(stageIndex, notes);

    res.json({
      success: true,
      message: 'Treatment stage completed successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Complete treatment stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete treatment stage'
    });
  }
};

// @desc    Add treatment session
// @route   POST /api/treatments/:id/sessions
// @access  Private/Doctor
const addTreatmentSession = async (req, res) => {
  try {
    const { date, time, duration, therapist, therapy, notes } = req.body;

    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check if user is the doctor for this treatment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (treatment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add session
    await treatment.addSession({
      date: new Date(date),
      time,
      duration,
      therapist,
      therapy,
      notes
    });

    res.json({
      success: true,
      message: 'Treatment session added successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Add treatment session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add treatment session'
    });
  }
};

// @desc    Complete treatment
// @route   PUT /api/treatments/:id/complete
// @access  Private/Doctor
const completeTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check if user is the doctor for this treatment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (treatment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Complete treatment
    await treatment.complete();

    res.json({
      success: true,
      message: 'Treatment completed successfully',
      data: { treatment }
    });
  } catch (error) {
    console.error('Complete treatment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete treatment'
    });
  }
};

// @desc    Get treatment progress
// @route   GET /api/treatments/:id/progress
// @access  Private
const getTreatmentProgress = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: 'Treatment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (treatment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (treatment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: {
        progress: treatment.progress,
        currentStage: treatment.currentStage,
        sessions: treatment.sessions,
        status: treatment.status
      }
    });
  } catch (error) {
    console.error('Get treatment progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch treatment progress'
    });
  }
};

// Mock AI service call
const callAIService = async (data) => {
  // This would be replaced with actual AI service integration
  return {
    stages: [
      {
        title: 'Detox Phase',
        description: 'Initial detoxification and preparation',
        duration: { value: 7, unit: 'days' },
        precautions: ['Avoid heavy meals', 'Stay hydrated', 'Get adequate rest'],
        dailyTasks: ['Morning meditation', 'Light yoga', 'Herbal tea'],
        weeklyTasks: ['Therapy session', 'Progress review'],
        therapies: [
          {
            name: 'Abhyanga',
            description: 'Full body oil massage',
            duration: 60,
            frequency: 'Daily',
            instructions: 'Use warm sesame oil, massage in circular motions'
          }
        ],
        medications: [
          {
            name: 'Triphala',
            dosage: '1 tsp',
            frequency: 'Twice daily',
            duration: '7 days',
            instructions: 'Take with warm water before meals'
          }
        ],
        diet: {
          allowed: ['Light soups', 'Steamed vegetables', 'Fresh fruits'],
          restricted: ['Heavy foods', 'Spicy foods', 'Cold drinks'],
          recommendations: ['Eat on time', 'Chew food properly', 'Stay hydrated']
        },
        lifestyle: {
          activities: ['Yoga', 'Meditation', 'Light walking'],
          restrictions: ['Stress', 'Late nights', 'Excessive screen time'],
          recommendations: ['Early sleep', 'Regular routine', 'Positive mindset']
        }
      },
      {
        title: 'Rejuvenation Phase',
        description: 'Strengthening and rejuvenation',
        duration: { value: 14, unit: 'days' },
        precautions: ['Follow diet strictly', 'Regular checkups', 'Monitor progress'],
        dailyTasks: ['Therapy sessions', 'Meditation', 'Light exercise'],
        weeklyTasks: ['Progress assessment', 'Diet review', 'Lifestyle counseling'],
        therapies: [
          {
            name: 'Shirodhara',
            description: 'Oil pouring on forehead',
            duration: 45,
            frequency: 'Every other day',
            instructions: 'Relax completely, focus on breathing'
          }
        ],
        medications: [
          {
            name: 'Ashwagandha',
            dosage: '500mg',
            frequency: 'Once daily',
            duration: '14 days',
            instructions: 'Take with milk before bed'
          }
        ],
        diet: {
          allowed: ['Nutritious foods', 'Fresh vegetables', 'Whole grains'],
          restricted: ['Processed foods', 'Junk food', 'Alcohol'],
          recommendations: ['Balanced diet', 'Regular meals', 'Adequate protein']
        },
        lifestyle: {
          activities: ['Exercise', 'Meditation', 'Reading'],
          restrictions: ['Late nights', 'Stress', 'Negative thoughts'],
          recommendations: ['Regular routine', 'Positive environment', 'Adequate rest']
        }
      }
    ],
    overallDuration: { value: 3, unit: 'weeks' },
    estimatedCost: 5000,
    successRate: 85,
    confidence: 0.8
  };
};

module.exports = {
  generateAITreatmentPlan,
  createTreatment,
  getTreatments,
  getTreatmentById,
  startTreatment,
  completeTreatmentStage,
  addTreatmentSession,
  completeTreatment,
  getTreatmentProgress
};