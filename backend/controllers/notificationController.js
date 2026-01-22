const pool = require('../config/database');

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_read } = req.query;
    
    let query = `
      SELECT 
        id,
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
      FROM public.notifications
      WHERE user_id = $1
    `;
    const params = [userId];
    
    if (is_read !== undefined) {
      query += ' AND is_read = $2';
      params.push(is_read === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    
    if (!user_id || !title || !message || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [user_id, title, message, type]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Create notifications for multiple users
const createBulkNotifications = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_ids, title, message, type } = req.body;
    
    if (!user_ids || !Array.isArray(user_ids) || !title || !message || !type) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'user_ids array, title, message, and type are required' });
    }
    
    const notifications = [];
    
    for (const user_id of user_ids) {
      const result = await client.query(`
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [user_id, title, message, type]);
      
      notifications.push(result.rows[0]);
    }
    
    await client.query('COMMIT');
    res.status(201).json({ 
      message: `Created ${notifications.length} notifications`,
      notifications 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating bulk notifications:', error);
    res.status(500).json({ error: 'Failed to create notifications' });
  } finally {
    client.release();
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE public.notifications 
      SET is_read = true 
      WHERE id = $1 
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      UPDATE public.notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `, [userId]);
    
    res.json({ 
      message: `Marked ${result.rows.length} notifications as read`,
      notifications: result.rows 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM public.notifications WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  getUserNotifications,
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
