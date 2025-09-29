const cron = require('node-cron');
const Appointment = require('../models/Appointment').default;
const TreatmentPlan = require('../models/TreatmentPlan');
const Patient = require('../models/Patient').default;
const Notification = require('../models/Notification').default;
const notificationDispatcher = require('./notificationDispatcher');

const startScheduledJobs = () => {
  console.log('🕒 Cron job scheduler started.');

  // This task runs at the beginning of every hour (e.g., 1:00, 2:00, 3:00).
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running hourly job: Checking for past appointments...');
    
    try {
      const now = new Date();

      // Find all appointments that are still "scheduled" but their date is in the past.
      // This assumes your 'date' field in the Appointment model is stored as a Date type.
      const result = await Appointment.updateMany(
        { 
          status: 'scheduled', 
          date: { $lt: now } 
        },
        { 
          $set: { status: 'completed' } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} appointments to 'completed'.`);
      } else {
        console.log('- No past-due appointments to update.');
      }
    } catch (error) {
      console.error('❌ Error running scheduled job to update appointments:', error);
    }
  });
  cron.schedule('0 7 * * *', async () => {
    console.log('☀️ Running daily job: Sending treatment plan reminders...');
    try {
      const activePlans = await TreatmentPlan.find({}).populate({
        path: 'patientId',
        select: 'user'
      });

      for (const plan of activePlans) {
        if (!plan.patientId || !plan.patientId.user) continue;

        const startDate = new Date(plan.createdAt);
        const today = new Date();
        const totalDaysInPlan = plan.schedule.length;

        const timeDifference = today.getTime() - startDate.getTime();
        const currentDay = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;

        if (currentDay > 0 && currentDay <= totalDaysInPlan) {
          const daysLeft = totalDaysInPlan - currentDay;

          const notification = await Notification.create({
            user: plan.patientId.user,
            type: 'treatment_reminder',
            title: `Today's Plan: Day ${currentDay} of ${totalDaysInPlan}`,
            message: `You have ${daysLeft} days left in your treatment. Remember to follow your prescribed tasks and submit your daily feedback.`,
            link: '/treatment/history',
            data: { planId: plan._id, currentDay: currentDay }
          });

          notificationDispatcher.dispatchNotification(notification);
        }
      }
    } catch (error) {
      console.error('❌ Error sending daily treatment reminders:', error);
    }
  });
  cron.schedule('0 8 * * *', async () => {
    console.log('🗓️ Running daily job: Sending appointment reminders...');
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
      const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));
      
      // Find all appointments scheduled for tomorrow
      const upcomingAppointments = await Appointment.find({
        status: 'scheduled',
        date: {
          $gte: startOfTomorrow,
          $lt: endOfTomorrow
        }
      }).populate([
        { path: 'patient', select: 'user' },
        { path: 'doctor', populate: { path: 'user', select: 'name' } }
      ]);
      
      for (const appt of upcomingAppointments) {
        if (!appt.patient || !appt.patient.user || !appt.doctor || !appt.doctor.user) continue;
        
        const notification = await Notification.create({
          user: appt.patient.user, // Patient's User ID
          type: 'appointment_reminder',
          title: 'Appointment Reminder',
          message: `You have an upcoming appointment with Dr. ${appt.doctor.user.name} tomorrow at ${appt.time}.`,
          link: '/my-appointments', // Link to the 'My Appointments' page
          data: { 
            appointmentId: appt._id, 
            doctorName: appt.doctor.user.name, 
            date: appt.date, 
            time: appt.time 
          }
        });
        
        notificationDispatcher.dispatchNotification(notification);
      }
    } catch (error) {
      console.error('❌ Error sending appointment reminders:', error);
    }
  });
};

module.exports = { startScheduledJobs };