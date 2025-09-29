const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination, validateAppointment } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Appointment routes
router.post('/', validateAppointment, appointmentController.createAppointment);
router.get('/', validatePagination, appointmentController.getAppointments);
router.get('/stats', appointmentController.getAppointmentStats);
router.get('/:id', validateObjectId('id'), appointmentController.getAppointmentById);
router.put('/:id', validateObjectId('id'), appointmentController.updateAppointment);
router.put('/:id/cancel', authorize('patient', 'doctor'), appointmentController.cancelAppointment);
router.put('/:id/reschedule', validateObjectId('id'), appointmentController.rescheduleAppointment);
router.put('/:id/complete', validateObjectId('id'), authorize('doctor'), appointmentController.completeAppointment);

module.exports = router;
