const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Patient routes
router.get('/', authorize('doctor', 'admin'), validatePagination, patientController.getAllPatients);
router.get('/:id', validateObjectId('id'), patientController.getPatientById);
router.put('/:id', validateObjectId('id'), patientController.updatePatient);
router.get('/:id/medical-history', validateObjectId('id'), patientController.getMedicalHistory);
router.post('/:id/medical-history', validateObjectId('id'), patientController.addMedicalHistory);
router.get('/:id/treatments', validateObjectId('id'), patientController.getPatientTreatments);
router.get('/:id/appointments', validateObjectId('id'), patientController.getPatientAppointments);

module.exports = router;
