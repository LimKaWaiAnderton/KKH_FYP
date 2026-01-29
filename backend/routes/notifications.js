import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

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

export default router;
