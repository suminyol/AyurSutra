const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor'])
    .withMessage('Role must be patient or doctor'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Doctor profile validation
const validateDoctorProfile = [
  body('licenseNumber')
    .notEmpty()
    .withMessage('Medical license number is required'),
  body('specialization')
    .isIn([
      'General Medicine',
      'Panchakarma Specialist',
      'Ayurvedic Medicine',
      'Internal Medicine',
      'Pediatrics',
      'Geriatrics',
      'Women\'s Health',
      'Mental Health',
      'Digestive Disorders',
      'Respiratory Disorders',
      'Skin Disorders',
      'Joint and Bone Disorders'
    ])
    .withMessage('Please select a valid specialization'),
  body('consultationFee')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number'),
  body('experience.years')
    .isInt({ min: 0 })
    .withMessage('Experience years must be a non-negative integer'),
  handleValidationErrors
];

// Patient profile validation
const validatePatientProfile = [
  body('medicalHistory')
    .optional()
    .isArray()
    .withMessage('Medical history must be an array'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('medications')
    .optional()
    .isArray()
    .withMessage('Medications must be an array'),
  body('emergencyContact.name')
    .notEmpty()
    .withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship')
    .notEmpty()
    .withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid emergency contact phone number'),
  handleValidationErrors
];

// Appointment validation
const validateAppointment = [
  body('doctor')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid appointment date'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  handleValidationErrors
];

// Treatment validation
const validateTreatment = [
  body('patient')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('doctor')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('appointment')
    .isMongoId()
    .withMessage('Please provide a valid appointment ID'),
  body('diagnosis.primary')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Primary diagnosis must be between 5 and 200 characters'),
  body('diagnosis.symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('method')
    .isIn(['cash', 'card', 'upi', 'netbanking', 'wallet'])
    .withMessage('Please select a valid payment method'),
  body('appointmentId')
    .isMongoId()
    .withMessage('Please provide a valid appointment ID'),
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} ID`),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('sort')
    .optional()
    .isIn(['name', 'date', 'rating', 'price'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (fieldName, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: `${fieldName} is required`
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      });
    }

    next();
  };
};

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateDoctorProfile,
  validatePatientProfile,
  validateAppointment,
  validateTreatment,
  validatePayment,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateFileUpload
};
