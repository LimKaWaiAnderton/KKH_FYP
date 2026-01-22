const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// POST create single notification
router.post('/', notificationController.createNotification);

// POST create bulk notifications for multiple users
router.post('/bulk', notificationController.createBulkNotifications);

// PUT mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// PUT mark all notifications as read for a user
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

// DELETE notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
