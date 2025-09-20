import { Schema, model } from 'mongoose';

const treatmentSchema = new Schema({
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
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  diagnosis: {
    primary: {
      type: String,
      required: [true, 'Primary diagnosis is required']
    },
    secondary: [String],
    symptoms: [String],
    notes: String
  },
  aiGeneratedPlan: {
    isGenerated: {
      type: Boolean,
      default: false
    },
    generatedAt: Date,
    stages: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      duration: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months'],
          default: 'days'
        }
      },
      precautions: [String],
      dailyTasks: [String],
      weeklyTasks: [String],
      therapies: [{
        name: String,
        description: String,
        duration: Number, // in minutes
        frequency: String,
        instructions: String
      }],
      medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
      }],
      diet: {
        allowed: [String],
        restricted: [String],
        recommendations: [String]
      },
      lifestyle: {
        activities: [String],
        restrictions: [String],
        recommendations: [String]
      }
    }],
    overallDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'weeks'
      }
    },
    estimatedCost: Number,
    successRate: Number,
    confidence: Number
  },
  doctorCustomizedPlan: {
    isCustomized: {
      type: Boolean,
      default: false
    },
    customizedAt: Date,
    customizedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    modifications: [{
      stageIndex: Number,
      field: String,
      originalValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      reason: String,
      modifiedAt: {
        type: Date,
        default: Date.now
      }
    }],
    stages: [{
      title: {
        type: String,
        required: true
      },
      description: String,
      duration: {
        value: Number,
        unit: {
          type: String,
          enum: ['days', 'weeks', 'months'],
          default: 'days'
        }
      },
      precautions: [String],
      dailyTasks: [String],
      weeklyTasks: [String],
      therapies: [{
        name: String,
        description: String,
        duration: Number,
        frequency: String,
        instructions: String
      }],
      medications: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
      }],
      diet: {
        allowed: [String],
        restricted: [String],
        recommendations: [String]
      },
      lifestyle: {
        activities: [String],
        restrictions: [String],
        recommendations: [String]
      }
    }],
    overallDuration: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'weeks'
      }
    },
    estimatedCost: Number
  },
  currentStage: {
    index: {
      type: Number,
      default: 0
    },
    title: String,
    startDate: Date,
    expectedEndDate: Date,
    actualEndDate: Date,
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  },
  progress: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    stages: [{
      stageIndex: Number,
      title: String,
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      startDate: Date,
      endDate: Date,
      isCompleted: {
        type: Boolean,
        default: false
      },
      completedAt: Date,
      notes: String
    }]
  },
  sessions: [{
    stageIndex: Number,
    stageTitle: String,
    date: {
      type: Date,
      required: true
    },
    time: String,
    duration: Number, // in minutes
    therapist: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    therapy: {
      name: String,
      description: String,
      instructions: String
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    notes: String,
    patientFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    },
    therapistNotes: String,
    checkInTime: Date,
    checkOutTime: Date
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  startDate: Date,
  endDate: Date,
  actualEndDate: Date,
  cost: {
    estimated: Number,
    actual: Number,
    paid: {
      type: Number,
      default: 0
    },
    remaining: Number
  },
  feedback: {
    patient: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    },
    doctor: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for treatment duration in days
treatmentSchema.virtual('durationInDays').get(function() {
  if (this.endDate && this.startDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for current stage progress
treatmentSchema.virtual('currentStageProgress').get(function() {
  if (this.progress.stages && this.progress.stages.length > 0) {
    const currentStage = this.progress.stages.find(stage => stage.stageIndex === this.currentStage.index);
    return currentStage ? currentStage.progress : 0;
  }
  return 0;
});

// Index for better query performance
treatmentSchema.index({ patient: 1, status: 1 });
treatmentSchema.index({ doctor: 1, status: 1 });
treatmentSchema.index({ appointment: 1 });
treatmentSchema.index({ status: 1 });
treatmentSchema.index({ startDate: 1, endDate: 1 });
treatmentSchema.index({ 'currentStage.index': 1 });

// Pre-save middleware to calculate progress
treatmentSchema.pre('save', function(next) {
  if (this.progress.stages && this.progress.stages.length > 0) {
    const totalStages = this.progress.stages.length;
    const completedStages = this.progress.stages.filter(stage => stage.isCompleted).length;
    this.progress.overall = Math.round((completedStages / totalStages) * 100);
  }
  
  // Calculate remaining cost
  if (this.cost.estimated && this.cost.paid) {
    this.cost.remaining = this.cost.estimated - this.cost.paid;
  }
  
  next();
});

// Instance method to generate AI treatment plan
treatmentSchema.methods.generateAIPlan = async function() {
  // This would integrate with AI service
  // For now, we'll create a mock plan
  this.aiGeneratedPlan = {
    isGenerated: true,
    generatedAt: new Date(),
    stages: [
      {
        title: 'Detox',
        description: 'Initial detoxification phase',
        duration: { value: 7, unit: 'days' },
        precautions: ['Avoid heavy meals', 'Stay hydrated'],
        dailyTasks: ['Morning meditation', 'Light exercise'],
        weeklyTasks: ['Therapy session', 'Progress review'],
        therapies: [],
        medications: [],
        diet: { allowed: ['Light foods'], restricted: ['Heavy foods'], recommendations: ['Eat on time'] },
        lifestyle: { activities: ['Yoga'], restrictions: ['Stress'], recommendations: ['Early sleep'] }
      },
      {
        title: 'Rejuvenation',
        description: 'Rejuvenation and strengthening phase',
        duration: { value: 14, unit: 'days' },
        precautions: ['Follow diet strictly', 'Regular checkups'],
        dailyTasks: ['Therapy sessions', 'Meditation'],
        weeklyTasks: ['Progress assessment', 'Diet review'],
        therapies: [],
        medications: [],
        diet: { allowed: ['Nutritious foods'], restricted: ['Processed foods'], recommendations: ['Balanced diet'] },
        lifestyle: { activities: ['Exercise'], restrictions: ['Late nights'], recommendations: ['Regular routine'] }
      }
    ],
    overallDuration: { value: 3, unit: 'weeks' },
    estimatedCost: 5000,
    successRate: 85,
    confidence: 0.8
  };
  
  return this.save();
};

// Instance method to customize treatment plan
treatmentSchema.methods.customizePlan = function(customizations, doctorId) {
  this.doctorCustomizedPlan = {
    isCustomized: true,
    customizedAt: new Date(),
    customizedBy: doctorId,
    modifications: customizations,
    stages: this.aiGeneratedPlan.stages.map((stage, index) => {
      const customization = customizations.find(c => c.stageIndex === index);
      if (customization) {
        return { ...stage, [customization.field]: customization.newValue };
      }
      return stage;
    }),
    overallDuration: this.aiGeneratedPlan.overallDuration,
    estimatedCost: this.aiGeneratedPlan.estimatedCost
  };
  
  return this.save();
};

// Instance method to start treatment
treatmentSchema.methods.start = function() {
  this.status = 'active';
  this.startDate = new Date();
  
  if (this.doctorCustomizedPlan.isCustomized) {
    this.progress.stages = this.doctorCustomizedPlan.stages.map((stage, index) => ({
      stageIndex: index,
      title: stage.title,
      progress: 0,
      startDate: null,
      endDate: null,
      isCompleted: false,
      completedAt: null,
      notes: ''
    }));
  } else {
    this.progress.stages = this.aiGeneratedPlan.stages.map((stage, index) => ({
      stageIndex: index,
      title: stage.title,
      progress: 0,
      startDate: null,
      endDate: null,
      isCompleted: false,
      completedAt: null,
      notes: ''
    }));
  }
  
  return this.save();
};

// Instance method to complete stage
treatmentSchema.methods.completeStage = function(stageIndex, notes = '') {
  const stage = this.progress.stages.find(s => s.stageIndex === stageIndex);
  if (stage) {
    stage.progress = 100;
    stage.isCompleted = true;
    stage.completedAt = new Date();
    stage.notes = notes;
  }
  
  // Move to next stage
  if (stageIndex === this.currentStage.index) {
    this.currentStage.index = stageIndex + 1;
    this.currentStage.isCompleted = true;
    this.currentStage.completedAt = new Date();
  }
  
  return this.save();
};

// Instance method to add session
treatmentSchema.methods.addSession = function(sessionData) {
  this.sessions.push({
    ...sessionData,
    stageIndex: this.currentStage.index,
    stageTitle: this.currentStage.title
  });
  return this.save();
};

// Instance method to complete treatment
treatmentSchema.methods.complete = function() {
  this.status = 'completed';
  this.actualEndDate = new Date();
  return this.save();
};

// Static method to find active treatments
treatmentSchema.statics.findActive = function(patientId = null) {
  const query = { status: 'active', isActive: true };
  if (patientId) {
    query.patient = patientId;
  }
  return this.find(query).populate('patient doctor');
};

// Static method to find treatments by stage
treatmentSchema.statics.findByStage = function(stageIndex) {
  return this.find({
    'currentStage.index': stageIndex,
    status: 'active',
    isActive: true
  }).populate('patient doctor');
};

export default model('Treatment', treatmentSchema);
