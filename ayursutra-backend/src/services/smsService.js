import twilio from 'twilio';

// Initialize the Twilio client with credentials from your .env file
// Make sure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are set
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async ({ to, message }) => {
  // Ensure 'to' number is in E.164 format (e.g., +919876543210)
  if (!to || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('SMS not sent: Missing recipient phone number or Twilio config.');
    return;
  }
  
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log(`SMS sent successfully to ${to}, SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`SMS sending error to ${to}:`, error.message);
    // Do not throw error here to prevent crashing the main flow,
    // just log it. You can integrate a more robust logging service later.
  }
};

// Your SMS templates remain the same
const smsTemplates = {
  appointment_confirmation: (data) => 
    `Hi ${data.patientName}, your appointment with Dr. ${data.doctorName} is confirmed for ${data.date} at ${data.time}. AyurSutra`,
  
  appointment_reminder: (data) => 
    `Reminder: You have an appointment with Dr. ${data.doctorName} tomorrow at ${data.time}. Please arrive 15 mins early. AyurSutra`,
  new_feedback: (data) => 
    `AyurSutra: New feedback for Day ${data.day} from patient ${data.patientName}. Mood: ${data.feedback.mentalState}, Pain: ${data.feedback.painLevel}/10. Please check your dashboard.`,
  treatment_plan: (data) =>
    `Hi ${data.patientName}, your new report from Dr. ${data.doctorName} is available in your AyurSutra dashboard.`
  // ... other templates
};

export {
  sendSMS,
  smsTemplates
};