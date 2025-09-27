const express = require('express');
const router = express.Router();
const {
    createPlan,
    getPlanForPatient,
    addFeedback
} = require('../controllers/treatmentPlanController');

// You can add authentication middleware here later if needed
// const { protect, authorize } = require('../middleware/auth');

router.post('/', createPlan);
router.get('/patient/:patientId', getPlanForPatient);
router.post('/:planId/feedback', addFeedback);

module.exports = router;