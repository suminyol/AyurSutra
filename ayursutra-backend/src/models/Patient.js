import { Schema, model } from 'mongoose';

const patientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  medicalHistory: [{
    condition: {
      type: String,
      required: true
    },
    diagnosisDate: Date,
    treatment: String,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    },
    notes: String
  }],
  allergies: [{
    allergen: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    reaction: String
  }],
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String,
    notes: String
  }],
  emergencyContact: {
    name: {
      type: String,
      required: false
    },
    relationship: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    email: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    communicationMethod: {
      type: String,
      enum: ['email', 'sms', 'phone'],
      default: 'email'
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    treatmentReminders: {
      type: Boolean,
      default: true
    }
  },
  prakritiAssessment: {
    vata: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    pitta: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    kapha: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    dominantDosha: {
      type: String,
      enum: ['vata', 'pitta', 'kapha', 'mixed'],
      default: 'mixed'
    },
    assessmentDate: Date,
    notes: String
  },
  currentTreatments: [{
    type: Schema.Types.ObjectId,
    ref: 'Treatment'
  }],
  completedTreatments: [{
    type: Schema.Types.ObjectId,
    ref: 'Treatment'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
patientSchema.virtual('age').get(function() {
  if (this.user && this.user.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Index for better query performance
//patientSchema.index({ user: 1 });
patientSchema.index({ 'prakritiAssessment.dominantDosha': 1 });
patientSchema.index({ isActive: 1 });

// Pre-save middleware to populate user data
patientSchema.pre('save', function(next) {
  if (this.isModified('prakritiAssessment')) {
    const { vata, pitta, kapha } = this.prakritiAssessment;
    
    // Determine dominant dosha
    const max = Math.max(vata, pitta, kapha);
    if (max === vata) {
      this.prakritiAssessment.dominantDosha = 'vata';
    } else if (max === pitta) {
      this.prakritiAssessment.dominantDosha = 'pitta';
    } else if (max === kapha) {
      this.prakritiAssessment.dominantDosha = 'kapha';
    } else {
      this.prakritiAssessment.dominantDosha = 'mixed';
    }
    
    this.prakritiAssessment.assessmentDate = new Date();
  }
  
  next();
});

// Instance method to add medical history
patientSchema.methods.addMedicalHistory = function(condition, diagnosisDate, treatment, status, notes) {
  this.medicalHistory.push({
    condition,
    diagnosisDate,
    treatment,
    status,
    notes
  });
  return this.save();
};

// Instance method to add allergy
patientSchema.methods.addAllergy = function(allergen, severity, reaction) {
  this.allergies.push({
    allergen,
    severity,
    reaction
  });
  return this.save();
};

// Instance method to add medication
patientSchema.methods.addMedication = function(name, dosage, frequency, startDate, prescribedBy, notes) {
  this.medications.push({
    name,
    dosage,
    frequency,
    startDate,
    prescribedBy,
    notes
  });
  return this.save();
};

// Static method to find patients by dosha
patientSchema.statics.findByDosha = function(dosha) {
  return this.find({ 'prakritiAssessment.dominantDosha': dosha });
};

// Static method to find patients with active treatments
patientSchema.statics.findWithActiveTreatments = function() {
  return this.find({ 
    currentTreatments: { $exists: true, $not: { $size: 0 } }
  }).populate('currentTreatments');
};

export default model('Patient', patientSchema);
