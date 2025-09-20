const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);

// Payment routes
router.post('/create-order', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/history', validatePagination, paymentController.getPaymentHistory);
router.get('/stats', paymentController.getPaymentStats);
router.post('/refund', authorize('admin'), paymentController.refundPayment);

module.exports = router;
