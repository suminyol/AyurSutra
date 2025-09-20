// SMS Service using Twilio or similar service
// For now, we'll create a mock implementation

const sendSMS = async ({ to, message }) => {
  try {
    // Mock SMS sending - replace with actual SMS service
    console.log(`SMS sent to ${to}: ${message}`);
    
    // In production, you would use a service like:
    // - Twilio
    // - AWS SNS
    // - TextLocal
    // - MSG91
    
    // Example with Twilio:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    return result;
    */
    
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      to,
      message
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};

// Send bulk SMS
const sendBulkSMS = async (messages) => {
  try {
    const results = await Promise.allSettled(
      messages.map(msg => sendSMS(msg))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Bulk SMS sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Bulk SMS sending error:', error);
    throw error;
  }
};

// SMS templates
const smsTemplates = {
  appointmentConfirmation: (data) => 
    `Hi ${data.patientName}, your appointment with Dr. ${data.doctorName} is confirmed for ${data.date} at ${data.time}. AyurSutra`,
  
  appointmentReminder: (data) => 
    `Reminder: You have an appointment with Dr. ${data.doctorName} tomorrow at ${data.time}. Please arrive 15 mins early. AyurSutra`,
  
  treatmentReminder: (data) => 
    `Hi ${data.patientName}, don't forget your ${data.therapyName} session today at ${data.time}. AyurSutra`,
  
  paymentConfirmation: (data) => 
    `Payment of ₹${data.amount} received for appointment on ${data.date}. Thank you! AyurSutra`,
  
  verificationCode: (data) => 
    `Your AyurSutra verification code is: ${data.code}. Valid for 10 minutes.`,
  
  passwordReset: (data) => 
    `Your password reset code is: ${data.code}. Valid for 10 minutes. AyurSutra`
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  smsTemplates
};
