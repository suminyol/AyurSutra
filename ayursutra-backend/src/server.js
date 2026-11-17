
require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = app.connectDB;
const { initSocket } = require('./socket');
const { startScheduledJobs } = require('./services/cronService');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.IO for local/persistent server hosting.
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    // Start cron jobs only in the persistent server process.
    startScheduledJobs();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 AyurSutra Backend Server is running!
📍 Server: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api-docs
🏥 Health Check: http://localhost:${PORT}/health
🌍 Environment: ${process.env.NODE_ENV || 'development'}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down AyurSutra server...');

  server.close(async () => {
    try {
      await require('./socket').closeSocket?.();
      await mongooseConnectionClose();
      process.exit(0);
    } catch (error) {
      console.error('Shutdown error:', error);
      process.exit(1);
    }
  });
};

const mongooseConnectionClose = async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
