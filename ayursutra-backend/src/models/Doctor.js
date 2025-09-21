import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
  // --- Core Information (from registration) ---
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // A user can only have one doctor profile
  },
  doctorID: {
    type: String,
    required: [true, 'Doctor ID is required'],
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0,
  },

  // --- Profile Information (can be added later by the doctor) ---
  consultationFee: {
    type: Number,
    default: 200,
    min: 0,
  },
  bio: { // A short biography for the doctor's profile page
    type: String,
    maxlength: 1000,
  },
  languages: [String], // Languages spoken, e.g., ['English', 'Hindi']
  clinic: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    phone: String,
  },
  
  // --- System & Interaction Data ---
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'Patient',
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isVerified: { // Can be set by an admin later
    type: Boolean,
    default: false,
  },
  isActive: { // Can be used to suspend a doctor's account
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total patients
doctorSchema.virtual('totalPatients').get(function() {
  return this.patients ? this.patients.length : 0;
});

// Indexes for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'clinic.city': 1 });
doctorSchema.index({ isActive: 1, isVerified: 1 });


export default model('Doctor', doctorSchema);