import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - AyurSutra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Welcome to AyurSutra!</h2>
        <p>Dear ${data.name},</p>
        <p>Thank you for registering with AyurSutra. Please verify your email address by clicking the link below:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.token}" 
           style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${process.env.FRONTEND_URL}/verify-email?token=${data.token}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>AyurSutra Team</p>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Reset Your Password - AyurSutra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Password Reset Request</h2>
        <p>Dear ${data.name},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.token}" 
           style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${process.env.FRONTEND_URL}/reset-password?token=${data.token}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>AyurSutra Team</p>
      </div>
    `
  }),
  
  appointmentConfirmation: (data) => ({
    subject: 'Appointment Confirmed - AyurSutra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Appointment Confirmed</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Type:</strong> ${data.type}</p>
          <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>AyurSutra Team</p>
      </div>
    `
  }),
  
  appointmentReminder: (data) => ({
    subject: 'Appointment Reminder - AyurSutra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Appointment Reminder</h2>
        <p>Dear ${data.patientName},</p>
        <p>This is a reminder for your upcoming appointment:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> ${data.doctorName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Type:</strong> ${data.type}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>AyurSutra Team</p>
      </div>
    `
  }),
  
  treatmentPlan: (data) => ({
    subject: 'Your Treatment Plan - AyurSutra',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Your Treatment Plan is Ready</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your personalized treatment plan has been created by Dr. ${data.doctorName}.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Duration:</strong> ${data.duration}</p>
          <p><strong>Stages:</strong> ${data.stages}</p>
          <p><strong>Estimated Cost:</strong> ₹${data.cost}</p>
        </div>
        <p>Please log in to your account to view the complete treatment plan and start your journey to wellness.</p>
        <a href="${process.env.FRONTEND_URL}/treatments" 
           style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          View Treatment Plan
        </a>
        <p>Best regards,<br>AyurSutra Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent;
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, '')
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Bulk email sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Bulk email sending error:', error);
    throw error;
  }
};

export {
  sendEmail,
  sendBulkEmails,
  emailTemplates
};
