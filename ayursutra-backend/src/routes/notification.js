const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Notification routes
router.get('/', validatePagination, notificationController.getNotifications);
router.get('/:id', validateObjectId('id'), notificationController.getNotificationById);
router.put('/:id/read', validateObjectId('id'), notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', validateObjectId('id'), notificationController.deleteNotification);

module.exports = router;
