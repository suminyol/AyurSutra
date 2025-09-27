const User = require('../models/User').default;
const Patient = require('../models/Patient').default;
const Doctor = require('../models/Doctor').default;
const { generateToken, generateRefreshToken, authRateLimit } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

// Rate limiting for auth endpoints
const loginRateLimit = authRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const registerRateLimit = authRateLimit(3, 60 * 60 * 1000); // 3 attempts per hour

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// PASTE THIS ENTIRE FUNCTION INTO authController.js
const register = async (req, res) => {
  console.log('--- BACKEND RECEIVED BODY ---', req.body); // Final check
  try {
    const {
      name, email, password, phone, dateOfBirth, gender, role = 'patient',
      // Doctor fields
      doctorId, qualification, specialization, yearsOfExperience
    } = req.body;

    const existingUser = await User.findByEmailOrPhone(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const user = await User.create({
      name, email, password, phone, dateOfBirth, gender, role
    });
    
    if (role === 'doctor') {
      // Use a try/catch here to be safe, but the validator should catch errors first
      await Doctor.create({
        user: user._id,
        doctorID: doctorId,
        specialization: specialization,
        qualification: qualification,
        yearsOfExperience: yearsOfExperience,
      });
    } else {
      await Patient.create({ user: user._id });
    }
    
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user: { id: user._id, name: user.name, role: user.role }, token }
    });

  } catch (error) {
    console.error('!!! REGISTRATION FAILED !!!', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed at the controller level.',
    });
  }
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmailOrPhone(email).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isLocked) {
      return res.status(401).json({ success: false, message: 'Account is temporarily locked. Please try again later.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.loginAttempts > 0) {
      await user.updateOne({ $unset: { loginAttempts: 1, lockUntil: 1 }, $set: { lastLogin: new Date() } });
    } else {
      await user.updateOne({ $set: { lastLogin: new Date() } });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // --- THIS IS THE NEW LOGIC ---
    // Create the base user object to send back
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      lastLogin: user.lastLogin
    };

    // If the user is a patient, find their Patient document and add the ID
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: user._id });
      if (patient) {
        userPayload.patientId = patient._id; // This is the ID your frontend needs!
      }
    }

    // If the user is a doctor, find their Doctor document and add the ID
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        userPayload.doctorId = doctor._id;
      }
    }
    // --- END OF NEW LOGIC ---

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userPayload, // Send the enhanced user object
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

// @desc    Verify phone
// @route   POST /api/auth/verify-phone
// @access  Public
const verifyPhone = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      phoneVerificationToken: token,
      phoneVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Phone verified successfully'
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Phone verification failed'
    });
  }
};

// @desc    Resend email verification
// @route   POST /api/auth/resend-email-verification
// @access  Public
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const emailVerificationToken = user.generateEmailVerificationToken();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'AyurSutra - Verify Your Email',
      template: 'emailVerification',
      data: {
        name: user.name,
        token: emailVerificationToken
      }
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }
};

// @desc    Resend phone verification
// @route   POST /api/auth/resend-phone-verification
// @access  Public
const resendPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone is already verified'
      });
    }

    const phoneVerificationToken = user.generatePhoneVerificationToken();
    await user.save();

    await sendSMS({
      to: user.phone,
      message: `Your AyurSutra verification code is: ${phoneVerificationToken}. Valid for 10 minutes.`
    });

    res.json({
      success: true,
      message: 'Verification SMS sent successfully'
    });
  } catch (error) {
    console.error('Resend phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification SMS'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'AyurSutra - Password Reset',
      template: 'passwordReset',
      data: {
        name: user.name,
        token: resetToken
      }
    });

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
};

module.exports = {
  // register: [registerRateLimit, register],
  register:  register,
  // login: [loginRateLimit, login],
  login: login,
  logout,
  refreshToken,
  verifyEmail,
  verifyPhone,
  resendEmailVerification,
  resendPhoneVerification,
  forgotPassword,
  resetPassword
};
