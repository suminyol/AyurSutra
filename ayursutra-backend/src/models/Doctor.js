import { Schema, model } from 'mongoose';

const doctorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    //required: [true, 'Medical license number is required'],
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'General Medicine',
      'Panchakarma Specialist',
      'Ayurvedic Medicine',
      'Internal Medicine',
      'Pediatrics',
      'Geriatrics',
      'Women\'s Health',
      'Mental Health',
      'Digestive Disorders',
      'Respiratory Disorders',
      'Skin Disorders',
      'Joint and Bone Disorders'
    ]
  },
  qualifications: [{
    degree: {
      type: String,
      //required: true
    },
    institution: {
      type: String,
      //required: true
    },
    year: {
      type: Number,
     // required: true
    },
    specialization: String
  }],
  experience: {
    years: {
      type: Number,
      //required: true,
      min: 0
    },
    description: String
  },
  consultationFee: {
    type: Number,
    //required: true,
    default: 200,
    min: 0
  },
  availability: {
    monday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    tuesday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    wednesday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    thursday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    friday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    saturday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }],
    sunday: [{
      start: String,
      end: String,
      isAvailable: {
        type: Boolean,
        default: false
      }
    }]
  },
  clinic: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    phone: String,
    email: String,
    website: String
  },
  services: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    duration: Number, // in minutes
    price: Number
  }],
  languages: [{
    type: String,
    enum: ['English', 'Hindi', 'Sanskrit', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  currentAppointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['license', 'degree', 'certificate', 'id_proof']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total patients
doctorSchema.virtual('totalPatients').get(function() {
  return this.patients ? this.patients.length : 0;
});

// Virtual for total appointments today
doctorSchema.virtual('todaysAppointments').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.currentAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today && appointmentDate < tomorrow;
  }).length;
});

// Index for better query performance
// doctorSchema.index({ user: 1 }); // Removed duplicate index for 'user'
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'clinic.city': 1 });
doctorSchema.index({ 'rating.average': -1 });
doctorSchema.index({ isVerified: 1 });
doctorSchema.index({ isActive: 1 });

// Pre-save middleware to calculate average rating
doctorSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
  next();
});

// Instance method to add review
doctorSchema.methods.addReview = function(patientId, rating, comment) {
  this.reviews.push({
    patient: patientId,
    rating,
    comment
  });
  return this.save();
};

// Instance method to add patient
doctorSchema.methods.addPatient = function(patientId) {
  if (!this.patients.includes(patientId)) {
    this.patients.push(patientId);
  }
  return this.save();
};

// Instance method to check availability
doctorSchema.methods.isAvailable = function(day, time) {
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule || daySchedule.length === 0) {
    return false;
  }
  
  return daySchedule.some(slot => {
    if (!slot.isAvailable) return false;
    return time >= slot.start && time <= slot.end;
  });
};

// Instance method to get available slots for a day
doctorSchema.methods.getAvailableSlots = function(day) {
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule) return [];
  
  return daySchedule.filter(slot => slot.isAvailable);
};

// Static method to find doctors by specialization
doctorSchema.statics.findBySpecialization = function(specialization) {
  return this.find({ specialization, isActive: true, isVerified: true });
};

// Static method to find doctors by location
doctorSchema.statics.findByLocation = function(city) {
  return this.find({ 
    'clinic.city': new RegExp(city, 'i'), 
    isActive: true, 
    isVerified: true 
  });
};

// Static method to find top rated doctors
doctorSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ 
    isActive: true, 
    isVerified: true 
  })
  .sort({ 'rating.average': -1 })
  .limit(limit);
};

export default model('Doctor', doctorSchema);
