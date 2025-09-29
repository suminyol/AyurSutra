const Appointment = require('../models/Appointment').default;
const Doctor = require('../models/Doctor').default;
const Patient = require('../models/Patient').default;
const Notification = require('../models/Notification').default;
const notificationDispatcher = require('../services/notificationDispatcher'); // Using require

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason, symptoms, type = 'consultation', patient: patientIdFromRequest } = req.body;

    const doctorExists = await Doctor.findOne({ _id: doctor, isActive: true }).populate('user', 'name email');
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: 'Doctor not found or inactive' });
    }

    let patientForAppointment;
    if (req.user.role === 'doctor' && patientIdFromRequest) {
      patientForAppointment = await Patient.findById(patientIdFromRequest).populate('user', 'name email phone');
    } else {
      patientForAppointment = await Patient.findOne({ user: req.user._id }).populate('user', 'name email phone');
    }

    if (!patientForAppointment) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const existingAppointment = await Appointment.findOne({
      doctor,
      date: new Date(date),
      time,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: patientForAppointment._id,
      doctor: doctorExists._id,
      date: new Date(date),
      time,
      reason,
      symptoms,
      type,
      payment: {
        amount: doctorExists.consultationFee || 0
      }
    });

    const notificationData = {
      doctorName: doctorExists.user.name,
      patientName: patientForAppointment.user.name,
      date: new Date(date).toLocaleDateString(),
      time,
      type,
      reason,
      appointmentId: appointment._id
    };

    await Notification.create({
        user: doctorExists.user._id,
        type: 'new_appointment',
        title: 'New Appointment Booked',
        message: `New appointment with ${notificationData.patientName} on ${notificationData.date} at ${notificationData.time}.`,
        link: `/doctor/appointments/${appointment._id}`,
        data: notificationData,
        deliveryMethod: ['in_app']
    });

    const patientNotification = await Notification.create({
        user: patientForAppointment.user._id,
        type: 'appointment_confirmation',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. ${notificationData.doctorName} on ${notificationData.date} is confirmed.`,
        link: `/patient/appointments/${appointment._id}`,
        data: notificationData,
        deliveryMethod: ['in_app', 'email', 'sms']
    });
    
    notificationDispatcher.dispatchNotification(patientNotification);
    
    await appointment.populate({ 
      path: 'doctor', 
      populate: { path: 'user', select: 'name email phone' } 
    });
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment'
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) query.doctor = doctor._id;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      query.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
    }
    if (req.query.type) query.type = req.query.type;

    const appointments = await Appointment.find(query)
      .populate([{ path: 'patient', populate: { path: 'user', select: 'name email phone' } }, { path: 'doctor', populate: { path: 'user', select: 'name email phone' } }])
      .sort({ date: -1, time: -1 });

    res.json({ success: true, data: { appointments } });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate([{ path: 'patient', populate: { path: 'user', select: 'name email phone' } }, { path: 'doctor', populate: { path: 'user', select: 'name email phone' } }]);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({ success: true, data: { appointment } });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointment' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { date, time, reason, symptoms, status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (appointment.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (symptoms) appointment.symptoms = symptoms;
    if (status) appointment.status = status;

    await appointment.save();
    await appointment.populate([{ path: 'patient', populate: { path: 'user', select: 'name email phone' } }, { path: 'doctor', populate: { path: 'user', select: 'name email phone' } }]);

    res.json({ success: true, message: 'Appointment updated successfully', data: { appointment } });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate([
        { path: 'doctor', populate: { path: 'user', select: 'id name' } },
        { path: 'patient', populate: { path: 'user', select: 'id name' } }
    ]);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    if (['cancelled', 'completed', 'no-show'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: 'Appointment cannot be cancelled' });
    }

    

    await appointment.cancel(reason, req.user.role);

    if (req.user.role === 'patient') {
      // If a patient cancels, notify the doctor
      if (appointment.doctor && appointment.doctor.user) {
        const notification = await Notification.create({
          user: appointment.doctor.user._id, // The DOCTOR's user ID
          type: 'appointment_cancelled',
          title: 'Appointment Cancelled',
          message: `Your appointment with ${appointment.patient.user.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
          link: `/doctor/appointments`, // Or a link to a specific appointment detail page
          data: { appointmentId: appointment._id, patientName: appointment.patient.user.name }
        });
        notificationDispatcher.dispatchNotification(notification);
      }
    }
    res.json({ success: true, message: 'Appointment cancelled successfully', data: { appointment } });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = async (req, res) => {
    try {
      const { newDate, newTime } = req.body;
  
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
      if (['cancelled', 'completed', 'no-show'].includes(appointment.status)) {
        return res.status(400).json({ success: false, message: 'Appointment cannot be rescheduled' });
      }
  
      if (req.user.role === 'patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (appointment.patient.toString() !== patient._id.toString()) {
          return res.status(403).json({ success: false, message: 'Access denied' });
        }
      } else if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (appointment.doctor.toString() !== doctor._id.toString()) {
          return res.status(403).json({ success: false, message: 'Access denied' });
        }
      }
  
      const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        date: new Date(newDate),
        time: newTime,
        status: { $in: ['scheduled', 'confirmed'] },
        _id: { $ne: appointment._id }
      });
  
      if (existingAppointment) {
        return res.status(400).json({ success: false, message: 'This time slot is already booked' });
      }
  
      await appointment.reschedule(new Date(newDate), newTime);
  
      res.json({ success: true, message: 'Appointment rescheduled successfully', data: { appointment } });
    } catch (error) {
      console.error('Reschedule appointment error:', error);
      res.status(500).json({ success: false, message: 'Failed to reschedule appointment' });
    }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private/Doctor
const completeAppointment = async (req, res) => {
  try {
    const { diagnosis, prescription, recommendations, followUpRequired, followUpDate, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    appointment.consultation = {
      diagnosis, prescription, recommendations, followUpRequired,
      followUpDate: followUpRequired ? new Date(followUpDate) : null,
      notes
    };
    await appointment.complete();

    res.json({ success: true, message: 'Appointment completed successfully', data: { appointment } });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete appointment' });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private
const getAppointmentStats = async (req, res) => {
    try {
      let matchStage = {};
  
      if (req.user.role === 'patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (patient) matchStage.patient = patient._id;
      } else if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor) matchStage.doctor = doctor._id;
      }
  
      if (req.query.startDate && req.query.endDate) {
        matchStage.date = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
      }
  
      const stats = await Appointment.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 }, totalRevenue: { $sum: '$payment.amount' } } }
      ]);
  
      const totalAppointments = await Appointment.countDocuments(matchStage);
      const totalRevenue = await Appointment.aggregate([
        { $match: matchStage },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]);
  
      res.json({
        success: true,
        data: {
          stats,
          totalAppointments,
          totalRevenue: totalRevenue[0]?.total || 0
        }
      });
    } catch (error) {
      console.error('Get appointment stats error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch appointment statistics' });
    }
};

// --- CORRECTED EXPORTS ---
// All controller functions are now included in the export block.
module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
  getAppointmentStats
};