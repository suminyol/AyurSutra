const Notification = require('../models/Notification').default;
const { authenticate } = require('../middleware/auth');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by read status
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
