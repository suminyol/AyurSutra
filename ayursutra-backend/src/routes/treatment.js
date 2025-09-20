const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination, validateTreatment } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Treatment routes
router.post('/generate-ai-plan', authorize('doctor'), treatmentController.generateAITreatmentPlan);
router.post('/', authorize('doctor'), validateTreatment, treatmentController.createTreatment);
router.get('/', validatePagination, treatmentController.getTreatments);
router.get('/:id', validateObjectId('id'), treatmentController.getTreatmentById);
router.get('/:id/progress', validateObjectId('id'), treatmentController.getTreatmentProgress);
router.put('/:id/start', validateObjectId('id'), authorize('doctor'), treatmentController.startTreatment);
router.put('/:id/complete-stage', validateObjectId('id'), authorize('doctor'), treatmentController.completeTreatmentStage);
router.put('/:id/complete', validateObjectId('id'), authorize('doctor'), treatmentController.completeTreatment);
router.post('/:id/sessions', validateObjectId('id'), authorize('doctor'), treatmentController.addTreatmentSession);

module.exports = router;
