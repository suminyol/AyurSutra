const http = require('http');
const { app, connectDB } = require('./app');
const { initSocket } = require('./socket'); // Import the Socket.IO initializer
const { startScheduledJobs } = require('./services/cronService');

const PORT = process.env.PORT || 3000;

// 1. Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// 2. Initialize Socket.IO and attach it to the HTTP server
initSocket(server);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    startScheduledJobs();
    // 3. Use the new server object to listen for connections
    server.listen(PORT, () => {
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

startServer();

