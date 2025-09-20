const Razorpay = require('razorpay');
const Stripe = require('stripe');
const Appointment = require('../models/Appointment').default;
const { authenticate, authorize } = require('../middleware/auth');

// Initialize payment gateways
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId, amount, method = 'razorpay' } = req.body;

    // Verify appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if payment already exists
    if (appointment.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed'
      });
    }

    let paymentOrder;

    if (method === 'razorpay') {
      // Create Razorpay order
      const options = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `appointment_${appointmentId}`,
        payment_capture: 1
      };

      paymentOrder = await razorpay.orders.create(options);
    } else if (method === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'inr',
        metadata: {
          appointmentId: appointmentId.toString()
        }
      });

      paymentOrder = {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret
      };
    }

    // Update appointment with payment details
    appointment.payment.transactionId = paymentOrder.id;
    appointment.payment.method = method;
    await appointment.save();

    res.json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        order: paymentOrder,
        appointmentId: appointment._id,
        amount: amount
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, paymentId, signature, method = 'razorpay' } = req.body;

    // Verify appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    let isVerified = false;

    if (method === 'razorpay') {
      // Verify Razorpay payment
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${appointment.payment.transactionId}|${paymentId}`)
        .digest('hex');

      isVerified = expectedSignature === signature;
    } else if (method === 'stripe') {
      // Verify Stripe payment
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      isVerified = paymentIntent.status === 'succeeded';
    }

    if (isVerified) {
      // Update appointment payment status
      appointment.payment.status = 'paid';
      appointment.payment.paidAt = new Date();
      await appointment.save();

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          appointmentId: appointment._id,
          paymentStatus: 'paid'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by user role
    if (req.user.role === 'patient') {
      const Patient = require('../models/Patient').default;
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) {
        query.patient = patient._id;
      }
    } else if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor').default;
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) {
        query.doctor = doctor._id;
      }
    }

    // Filter by payment status
    if (req.query.status) {
      query['payment.status'] = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query['payment.paidAt'] = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate([
        { path: 'patient', populate: { path: 'user', select: 'name email' } },
        { path: 'doctor', populate: { path: 'user', select: 'name email' } }
      ])
      .sort({ 'payment.paidAt': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    // Calculate total revenue
    const revenueStats = await Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          totalPaid: { $sum: '$payment.paid' },
          totalPending: { $sum: { $subtract: ['$payment.amount', '$payment.paid'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        payments: appointments.map(apt => ({
          id: apt._id,
          date: apt.date,
          time: apt.time,
          patient: apt.patient?.user?.name,
          doctor: apt.doctor?.user?.name,
          amount: apt.payment.amount,
          status: apt.payment.status,
          method: apt.payment.method,
          paidAt: apt.payment.paidAt
        })),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        revenue: revenueStats[0] || { totalRevenue: 0, totalPaid: 0, totalPending: 0 }
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private/Admin
const refundPayment = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body;

    // Verify appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    let refund;

    if (appointment.payment.method === 'razorpay') {
      // Process Razorpay refund
      refund = await razorpay.payments.refund(appointment.payment.transactionId, {
        amount: appointment.payment.amount * 100, // Convert to paise
        notes: {
          reason: reason,
          appointmentId: appointmentId
        }
      });
    } else if (appointment.payment.method === 'stripe') {
      // Process Stripe refund
      refund = await stripe.refunds.create({
        payment_intent: appointment.payment.transactionId,
        amount: appointment.payment.amount * 100, // Convert to cents
        reason: 'requested_by_customer',
        metadata: {
          appointmentId: appointmentId,
          reason: reason
        }
      });
    }

    // Update appointment payment status
    appointment.payment.status = 'refunded';
    await appointment.save();

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        refundId: refund.id,
        amount: appointment.payment.amount,
        status: 'refunded'
      }
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private
const getPaymentStats = async (req, res) => {
  try {
    let matchStage = {};

    // Filter by user role
    if (req.user.role === 'patient') {
      const Patient = require('../models/Patient').default;
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) {
        matchStage.patient = patient._id;
      }
    } else if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor').default;
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) {
        matchStage.doctor = doctor._id;
      }
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      matchStage['payment.paidAt'] = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const stats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
        }
      }
    ]);

    const totalStats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          totalPaid: { $sum: '$payment.paid' },
          totalPending: { $sum: { $subtract: ['$payment.amount', '$payment.paid'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totals: totalStats[0] || { totalRevenue: 0, totalPaid: 0, totalPending: 0 }
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  refundPayment,
  getPaymentStats
};
