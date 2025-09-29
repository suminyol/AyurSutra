const TreatmentPlan = require('../models/TreatmentPlan');
const Notification = require('../models/Notification').default;
const Patient = require('../models/Patient').default; 
const Appointment = require('../models/Appointment').default;
const notificationDispatcher = require('../services/notificationDispatcher');
const Doctor = require('../models/Doctor').default; 

/**
 * @desc    Create a new treatment plan
 * @route   POST /api/treatment-plans
 * @access  Private
 */
exports.createPlan = async (req, res) => {
    try {
        const { patientId, doctorId, patientName, summary, schedule, formData } = req.body;
        
        const newPlan = new TreatmentPlan({
            patientId,
            doctorId,
            patientName,
            summary,
            schedule,
            formData
        });

        const savedPlan = await newPlan.save();
        if (savedPlan) {
            // Find the User ID associated with the Patient ID to send the notification
            const patientRecord = await Patient.findById(patientId).select('user');
            if (patientRecord && patientRecord.user) {
                // Find the doctor's name for the message
                const doctor = await Doctor.findById(doctorId).populate('user', 'name');
                const doctorName = doctor?.user?.name || 'your doctor';

                // Create the notification in the database
                const notification = await Notification.create({
                    user: patientRecord.user, // The patient's User ID
                    type: 'treatment_plan',
                    title: 'Your Treatment Plan is Ready',
                    message: `Dr. ${doctorName} has created a new treatment plan for you. Click to view.`,
                    link: '/treatment/history', // This is the link the patient will be navigated to
                    data: {
                        planId: savedPlan._id,
                        patientId: patientId,
                        doctorName: doctorName
                    }
                });

                // Dispatch the notification for real-time update
                notificationDispatcher.dispatchNotification(notification);
            }
        }
        res.status(201).json({ success: true, data: savedPlan });
    } catch (error) {
        console.error('Error creating treatment plan:', error);
        res.status(500).json({ success: false, message: 'Error creating plan', error: error.message });
    }
};

/**
 * @desc    Get the treatment plan for a specific patient
 * @route   GET /api/treatment-plans/patient/:patientId
 * @access  Private
 */
exports.getPlanForPatient = async (req, res) => {
    try {
        const plan = await TreatmentPlan.findOne({ patientId: req.params.patientId })
                                        .sort({ createdAt: -1 });
        if (!plan) {
            return res.status(404).json({ success: false, message: 'No treatment plan found for this patient.' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        console.error('Error fetching treatment plan:', error);
        res.status(500).json({ success: false, message: 'Error fetching plan', error: error.message });
    }
};

/**
 * @desc    Add feedback to a plan and notify the doctor
 * @route   PUT /api/treatment-plans/:planId/feedback
 * @access  Private
 */
exports.addFeedback = async (req, res) => {
    const { dayNumber, feedbackData } = req.body;
    const { planId } = req.params;

    if (!dayNumber || !feedbackData) {
        return res.status(400).json({ success: false, message: 'Day number and feedback data are required.' });
    }

    try {
        const plan = await TreatmentPlan.findById(planId).populate({
            path: 'doctorId',
            populate: { path: 'user', select: 'name' }
        });
            
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Treatment plan not found.' });
        }

        const dayToUpdate = plan.schedule.find(d => d.day === dayNumber);
        if (!dayToUpdate) {
            return res.status(404).json({ success: false, message: `Day ${dayNumber} not found in the plan.` });
        }

        // Set the feedback with a submission timestamp
        dayToUpdate.feedback = {
            ...feedbackData,
            submittedAt: new Date()
        };
        
        // Explicitly tell Mongoose that the 'schedule' array has been modified.
        // This is a robust way to ensure changes within nested objects are saved.
        plan.markModified('schedule');
        
        const updatedPlan = await plan.save();

        let doctorUser = null;

        // Primary Method: Get doctor from the populated plan.
        if (plan.doctorId && plan.doctorId.user) {
            doctorUser = plan.doctorId.user;
            const notification = await Notification.create({
            user: doctorUser._id,
            type: 'feedback',
            title: 'New Patient Feedback Received',
            // --- THIS IS THE CORRECTED MESSAGE ---
            message: `Feedback for Day ${dayNumber} has been submitted by ${plan.patientName}.`,
            link: `/doctor/patients/${plan.patientId}`, // This link is now correct
            data: {
                patientName: plan.patientName,
                patientId: plan.patientId,
                doctorName: doctorUser.name,
                day: dayNumber,
                feedback: feedbackData
            },
            deliveryMethod: ['in_app', 'email']
        });
            
            console.log(`Doctor found via TreatmentPlan: ${doctorUser.name}`);
        } 
        // Fallback Method: Find the patient's most recent appointment to get the doctor.
        else {
            console.warn(`Doctor not found on TreatmentPlan. Attempting fallback via last Appointment.`);
            
            const lastAppointment = await Appointment.findOne({ patient: plan.patientId })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'doctor',
                    populate: {
                        path: 'user',
                        select: 'name'
                    }
                });

            if (lastAppointment && lastAppointment.doctor && lastAppointment.doctor.user) {
                doctorUser = lastAppointment.doctor.user;
                console.log(`Doctor found via last Appointment fallback: ${doctorUser.name}`);
            }
        }

        if (doctorUser) {
            const notification = await Notification.create({
                user: doctorUser._id,
                // --- START: MODIFIED SECTION ---
                // Changed 'new_feedback' to 'feedback' to match the schema's allowed enum values.
                type: 'feedback',
                // --- END: MODIFIED SECTION ---
                title: 'New Patient Feedback Received',
                message: `Feedback for Day ${dayNumber} has been submitted by ${plan.patientName}.`,
                link: `/patient/${plan.patientId}`,
                data: {
                    patientName: plan.patientName,
                    patientId: plan.patientId,
                    doctorName: doctorUser.name,
                    day: dayNumber,
                    feedback: feedbackData
                },
                deliveryMethod: ['in_app', 'email']
            });

            notificationDispatcher.dispatchNotification(notification);
            console.log(`Notification created and dispatched for Dr. ${doctorUser.name}.`);
        } else {
            console.error(`CRITICAL: Could not send notification for plan ${planId}. No associated doctor could be found.`);
        }

        res.status(200).json({ success: true, data: updatedPlan });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ success: false, message: 'Error adding feedback', error: error.message });
    }
};

/**
 * @desc    Update a treatment plan by a doctor
 * @route   PUT /api/treatment-plans/:planId
 * @access  Private (Doctor)
 */
exports.updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const { schedule, summary } = req.body; // Get the updated schedule and summary

        const plan = await TreatmentPlan.findById(planId);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Treatment plan not found.' });
        }

        // Update the fields
        plan.schedule = schedule || plan.schedule;
        plan.summary = summary || plan.summary;
        
        // Let Mongoose know that the nested 'schedule' array has changed
        plan.markModified('schedule');

        const updatedPlan = await plan.save();

        const patientRecord = await Patient.findById(updatedPlan.patientId).select('user');
        if (patientRecord && patientRecord.user) {
            const doctor = await Doctor.findById(updatedPlan.doctorId).populate('user', 'name');
            const doctorName = doctor?.user?.name || 'your doctor';

            // Create the notification in the database
            const notification = await Notification.create({
                user: patientRecord.user, // The patient's User ID
                type: 'treatment_plan', // This type can be reused
                title: 'Your Treatment Plan Has Been Updated',
                message: `Dr. ${doctorName} has made changes to your treatment plan.`,
                link: '/treatment/history', // We will confirm this route next
                data: {
                    planId: updatedPlan._id,
                    patientId: updatedPlan.patientId,
                    doctorName: doctorName
                }
            });

            // Dispatch the notification for a real-time update
            notificationDispatcher.dispatchNotification(notification);
        }

        res.status(200).json({ success: true, data: updatedPlan });

    } catch (error) {
        console.error('Error updating treatment plan:', error);
        res.status(500).json({ success: false, message: 'Error updating plan', error: error.message });
    }
};