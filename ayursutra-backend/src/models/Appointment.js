import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 30, // in minutes
    min: 15,
    max: 120
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'therapy'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Appointment reason is required']
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  },
  consultation: {
    diagnosis: String,
    prescription: [{
      medicine: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    recommendations: [String],
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date,
    notes: String
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'netbanking', 'wallet'],
      default: 'upi'
    },
    transactionId: String,
    paidAt: Date
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  rescheduledFrom: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  rescheduledTo: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'admin']
  },
  cancelledAt: Date,
  checkInTime: Date,
  checkOutTime: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment duration in hours
appointmentSchema.virtual('durationInHours').get(function() {
  return this.duration / 60;
});

// Virtual for appointment status color
appointmentSchema.virtual('statusColor').get(function() {
  const statusColors = {
    'scheduled': 'blue',
    'confirmed': 'green',
    'in-progress': 'orange',
    'completed': 'green',
    'cancelled': 'red',
    'no-show': 'gray',
    'rescheduled': 'yellow'
  };
  return statusColors[this.status] || 'gray';
});

// Index for better query performance
appointmentSchema.index({ patient: 1, date: -1 });
appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ createdAt: -1 });

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', function(next) {
  // Only run these validations for new appointments or if the date is modified.
  if (this.isNew || this.isModified('date')) {
    // Check if appointment date is not in the past
    const today = new Date(); // e.g. 2024-07-21T10:00:00.000-04:00
    today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC for a fair date-only comparison
    if (this.date < today) {
      return next(new Error('Appointment date cannot be in the past'));
    }
    
    // Check if appointment is not more than 3 months in advance
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setUTCMonth(threeMonthsFromNow.getUTCMonth() + 3);
    if (this.date > threeMonthsFromNow) {
      return next(new Error('Appointment cannot be scheduled more than 3 months in advance'));
    }
  }
  next();
});

// Instance method to confirm appointment
appointmentSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

// Instance method to cancel appointment
appointmentSchema.methods.cancel = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  return this.save();
};

// Instance method to reschedule appointment
appointmentSchema.methods.reschedule = function(newDate, newTime) {
  this.status = 'rescheduled';
  this.date = newDate;
  this.time = newTime;
  return this.save();
};

// Instance method to mark as completed
appointmentSchema.methods.complete = function() {
  this.status = 'completed';
  this.checkOutTime = new Date();
  return this.save();
};

// Instance method to check in
appointmentSchema.methods.checkIn = function() {
  this.status = 'in-progress';
  this.checkInTime = new Date();
  return this.save();
};

// Instance method to add reminder
appointmentSchema.methods.addReminder = function(type, status = 'sent') {
  this.reminders.push({
    type,
    sentAt: new Date(),
    status
  });
  return this.save();
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate, doctorId = null) {
  const query = {
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query).populate('patient doctor');
};

// Static method to find today's appointments
appointmentSchema.statics.findTodaysAppointments = function(doctorId = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const query = {
    date: {
      $gte: today,
      $lt: tomorrow
    }
  };
  
  if (doctorId) {
    query.doctor = doctorId;
  }
  
  return this.find(query).populate('patient doctor');
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function(patientId, limit = 5) {
  return this.find({
    patient: patientId,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  })
  .sort({ date: 1, time: 1 })
  .limit(limit)
  .populate('doctor');
};

// Static method to find appointment statistics
appointmentSchema.statics.getStatistics = function(doctorId, startDate, endDate) {
  const matchStage = {
    doctor: doctorId,
    date: { $gte: startDate, $lte: endDate }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$payment.amount' }
      }
    }
  ]);
};

export default model('Appointment', appointmentSchema);
