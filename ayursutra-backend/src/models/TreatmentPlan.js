const mongoose = require('mongoose');

// FeedbackSchema and DayScheduleSchema remain the same...

const FeedbackSchema = new mongoose.Schema({
    painLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    energyLevel: { type: Number, required: true },
    appetite: { type: String, required: true },
    digestion: { type: String, required: true },
    sleepQuality: { type: String, required: true },
    mentalState: { type: String, required: true },
    notes: { type: String },
    submissionDate: { type: Date, default: Date.now }
});

const DayScheduleSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    plan: [{ type: String }],
    doctor_consultation: { type: String },
    therapist_name: { type: String }, // Added therapist_name field
    feedback: { type: FeedbackSchema }
});

// The main schema for the entire treatment plan
const TreatmentPlanSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    // --- ADD THIS FIELD ---
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // This links to your existing Doctor model
        required: true
    },
    patientName: { type: String, required: true },
    summary: { type: String },
    schedule: [DayScheduleSchema],
    formData: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('TreatmentPlan', TreatmentPlanSchema);