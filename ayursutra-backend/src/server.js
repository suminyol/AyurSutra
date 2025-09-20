const { app, connectDB } = require('./app');

const PORT = process.env.PORT || 3000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
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
