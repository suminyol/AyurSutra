const { sendEmail } = require('./emailService');
const { sendSMS, smsTemplates } = require('./smsService');
const User = require('../models/User').default;
const { getIO } = require('../socket'); // 👈 Import the getIO function

/**
 * Dispatches a notification to the channels specified in its deliveryMethod array.
 * @param {object} notification - The Mongoose notification document.
 */
const dispatchNotification = async (notification) => {
  try {
    const user = await User.findById(notification.user);
    if (!user) {
      console.error(`User not found for notification dispatch: ${notification.user}`);
      return;
    }

    // --- 1. EMIT REAL-TIME EVENT (for live UI updates) ---
    // The notification is sent to the user's private room, which they joined on login.
    const io = getIO();
    io.to(user._id.toString()).emit('new_notification', notification);
    // --- END REAL-TIME LOGIC ---

    // --- 2. Dispatch to Email Channel ---
    if (notification.deliveryMethod.includes('email') && user.email) {
      await sendEmail({
        to: user.email,
        template: notification.type,
        data: {
          name: user.name,
          patientName: user.name,
          ...notification.data,
        },
      });
    }

    // --- 3. Dispatch to SMS Channel ---
    if (notification.deliveryMethod.includes('sms') && user.phone) {
      const message = smsTemplates[notification.type]
        ? smsTemplates[notification.type]({ patientName: user.name, ...notification.data })
        : notification.message;
      
      await sendSMS({ to: user.phone, message });
    }

  } catch (error) {
    console.error(`Failed to dispatch notification ID ${notification._id}:`, error);
  }
};

module.exports = {
  dispatchNotification,
};

