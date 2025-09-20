const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateUserRegistration, authController.register);
router.post('/login', validateUserLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/verify-email', authController.verifyEmail);
router.post('/verify-phone', authController.verifyPhone);
router.post('/resend-email-verification', authController.resendEmailVerification);
router.post('/resend-phone-verification', authController.resendPhoneVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/logout', authenticate, authController.logout);

module.exports = router;
