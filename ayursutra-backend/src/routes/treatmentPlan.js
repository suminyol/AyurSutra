// treatmentPlan.js

const express = require('express');
const router = express.Router();
const {
    createPlan,
    getPlanForPatient,
    addFeedback,
    updatePlan 
} = require('../controllers/treatmentPlanController');

// --- START: MODIFIED SECTION ---
// Add authentication middleware. Assuming 'authenticate' is the correct middleware used elsewhere.
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);
// --- END: MODIFIED SECTION ---


router.post('/', createPlan);
router.get('/patient/:patientId', getPlanForPatient);
router.put('/:planId/feedback', addFeedback);
router.put('/:planId', updatePlan);

module.exports = router;