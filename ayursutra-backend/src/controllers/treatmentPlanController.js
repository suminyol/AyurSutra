const TreatmentPlan = require('../models/TreatmentPlan');

// @desc    Create a new treatment plan
// @route   POST /api/v1/treatment-plans
exports.createPlan = async (req, res) => {
    try {
        // Now you also get the doctorId from the request body
        const { patientId, doctorId, patientName, summary, schedule, formData } = req.body;
        
        const newPlan = new TreatmentPlan({
            patientId,
            doctorId, // <-- Save the doctor's ID
            patientName,
            summary,
            schedule,
            formData
        });

        const savedPlan = await newPlan.save();
        res.status(201).json({ success: true, data: savedPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating plan', error: error.message });
    }
};

// @desc    Get the treatment plan for a specific patient
// @route   GET /api/v1/treatment-plans/patient/:patientId
exports.getPlanForPatient = async (req, res) => {
    try {
        const plan = await TreatmentPlan.findOne({ patientId: req.params.patientId })
                                        .sort({ createdAt: -1 }); // Get the newest one
        if (!plan) {
            return res.status(404).json({ success: false, message: 'No treatment plan found for this patient.' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching plan', error: error.message });
    }
};

// @desc    Add feedback to a specific day in a plan
// @route   POST /api/v1/treatment-plans/:planId/feedback
exports.addFeedback = async (req, res) => {
    const { dayNumber, feedbackData } = req.body;
    const { planId } = req.params;

    if (!dayNumber || !feedbackData) {
        return res.status(400).json({ success: false, message: 'Day number and feedback data are required.' });
    }

    try {
        const plan = await TreatmentPlan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Treatment plan not found.' });
        }

        const dayToUpdate = plan.schedule.find(d => d.day === dayNumber);
        if (!dayToUpdate) {
            return res.status(404).json({ success: false, message: `Day ${dayNumber} not found in the plan.` });
        }

        dayToUpdate.feedback = feedbackData;
        const updatedPlan = await plan.save();

        res.status(200).json({ success: true, data: updatedPlan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding feedback', error: error.message });
    }
};