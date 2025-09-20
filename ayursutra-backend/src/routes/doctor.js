const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Doctor routes
router.get('/', validatePagination, doctorController.getAllDoctors);
router.get('/:id', validateObjectId('id'), doctorController.getDoctorById);
router.put('/:id', validateObjectId('id'), doctorController.updateDoctor);
router.get('/:id/availability', validateObjectId('id'), doctorController.getDoctorAvailability);
router.put('/:id/availability', validateObjectId('id'), doctorController.updateDoctorAvailability);
router.get('/:id/patients', validateObjectId('id'), doctorController.getDoctorPatients);
router.get('/:id/appointments', validateObjectId('id'), doctorController.getDoctorAppointments);
router.get('/:id/reviews', validateObjectId('id'), doctorController.getDoctorReviews);

module.exports = router;
