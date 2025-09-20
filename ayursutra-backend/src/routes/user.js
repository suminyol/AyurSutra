const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.post('/profile-image', upload.single('image'), userController.uploadProfileImage);
router.delete('/account', userController.deleteAccount);

// Admin routes
router.get('/', authorize('admin'), validatePagination, userController.getAllUsers);
router.get('/:id', authorize('admin'), validateObjectId('id'), userController.getUserById);
router.put('/:id/status', authorize('admin'), validateObjectId('id'), userController.updateUserStatus);

module.exports = router;
