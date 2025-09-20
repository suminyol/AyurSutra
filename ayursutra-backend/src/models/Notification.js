import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'appointment_reminder',
      'appointment_confirmation',
      'appointment_cancelled',
      'appointment_rescheduled',
      'treatment_reminder',
      'treatment_stage_completed',
      'treatment_completed',
      'payment_confirmation',
      'payment_failed',
      'general',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  },
  deliveryMethod: {
    type: [String],
    enum: ['in_app', 'email', 'sms', 'push'],
    default: ['in_app']
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

// Index for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ isActive: 1 });

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Static method to create notification
notificationSchema.statics.createNotification = function(userId, type, title, message, data = {}, options = {}) {
  return this.create({
    user: userId,
    type,
    title,
    message,
    data,
    priority: options.priority || 'medium',
    scheduledFor: options.scheduledFor || new Date(),
    deliveryMethod: options.deliveryMethod || ['in_app']
  });
};

// Static method to send appointment reminder
notificationSchema.statics.sendAppointmentReminder = function(userId, appointmentData) {
  return this.createNotification(
    userId,
    'appointment_reminder',
    'Appointment Reminder',
    `You have an appointment with Dr. ${appointmentData.doctorName} tomorrow at ${appointmentData.time}`,
    { appointmentId: appointmentData.appointmentId },
    {
      priority: 'high',
      deliveryMethod: ['in_app', 'email', 'sms']
    }
  );
};

// Static method to send treatment reminder
notificationSchema.statics.sendTreatmentReminder = function(userId, treatmentData) {
  return this.createNotification(
    userId,
    'treatment_reminder',
    'Treatment Session Reminder',
    `Don't forget your ${treatmentData.therapyName} session today at ${treatmentData.time}`,
    { treatmentId: treatmentData.treatmentId },
    {
      priority: 'high',
      deliveryMethod: ['in_app', 'sms']
    }
  );
};

// Static method to send payment confirmation
notificationSchema.statics.sendPaymentConfirmation = function(userId, paymentData) {
  return this.createNotification(
    userId,
    'payment_confirmation',
    'Payment Confirmed',
    `Payment of ₹${paymentData.amount} received for appointment on ${paymentData.date}`,
    { paymentId: paymentData.paymentId },
    {
      priority: 'medium',
      deliveryMethod: ['in_app', 'email']
    }
  );
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to mark as sent
notificationSchema.methods.markAsSent = function() {
  this.sentAt = new Date();
  return this.save();
};

export default model('Notification', notificationSchema);
