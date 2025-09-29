const cron = require('node-cron');
const Appointment = require('../models/Appointment').default; // Adjust path if needed

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
};

module.exports = { startScheduledJobs };