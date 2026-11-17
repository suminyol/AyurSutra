
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// ==========================================
// BODY PARSING
// ==========================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// LOGGING
// ==========================================

app.use(
  process.env.NODE_ENV === 'development'
    ? morgan('dev')
    : morgan('combined')
);

// Ensure MongoDB is connected before handling API requests
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ==========================================
// RATE LIMITING
// ==========================================

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AyurSutra Backend API',
    documentation: '/api-docs',
    health: '/health'
  });
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AyurSutra API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected'
  });
});

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const treatmentRoutes = require('./routes/treatment');
const paymentRoutes = require('./routes/payment');
const notificationRoutes = require('./routes/notification');
const therapyRoutes = require('./routes/therapy');
const treatmentPlanRoutes = require('./routes/treatmentPlan');

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/therapy', therapyRoutes);
app.use('/api/treatment-plans', treatmentPlanRoutes);

// ==========================================
// SWAGGER DOCUMENTATION
// ==========================================

// Available in both development and production.
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ==========================================
// ERROR HANDLING
// ==========================================

const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

app.use(notFound);
app.use(errorHandler);

// ==========================================
// DATABASE CONNECTION
// ==========================================

// Reuse the connection across serverless invocations.
let dbConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        dbConnectionPromise = null;
        console.error('Database connection error:', error.message);
        throw error;
      });
  }

  return dbConnectionPromise;
};

// ==========================================
// EXPORTS
// ==========================================

// Keep both exports for local server.js.
// Vercel receives a function through api/index.js.
// Export the Express app directly for Vercel.
// Keep connectDB attached for the local server.
module.exports = app;
module.exports.connectDB = connectDB;
