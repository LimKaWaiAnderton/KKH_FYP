const pool = require('../db/pool');

// Get all shift requests
const getAllShiftRequests = async (req, res) => {
  try {
    const { status, user_id } = req.query;
    
    let query = `
      SELECT 
        sr.id,
        sr.user_id,
        u.first_name,
        u.last_name,
        u.email,
        sr.date,
        sr.preferred_shift,
        sr.status,
        sr.shift_type_id,
        st.name as shift_type,
        st.color_hex,
        sr.time,
        sr.created_at
      FROM public.shift_requests sr
      JOIN public.users u ON sr.user_id = u.id
      LEFT JOIN public.shift_types st ON sr.shift_type_id = st.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND sr.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (user_id) {
      query += ` AND sr.user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }
    
    query += ' ORDER BY sr.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching shift requests:', error);
    res.status(500).json({ error: 'Failed to fetch shift requests' });
  }
};

// Get shift request by ID
const getShiftRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        sr.id,
        sr.user_id,
        u.first_name,
        u.last_name,
        u.email,
        sr.date,
        sr.preferred_shift,
        sr.status,
        sr.shift_type_id,
        st.name as shift_type,
        st.color_hex,
        sr.time,
        sr.created_at
      FROM public.shift_requests sr
      JOIN public.users u ON sr.user_id = u.id
      LEFT JOIN public.shift_types st ON sr.shift_type_id = st.id
      WHERE sr.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shift request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching shift request:', error);
    res.status(500).json({ error: 'Failed to fetch shift request' });
  }
};

// Create shift request
const createShiftRequest = async (req, res) => {
  try {
    const { user_id, date, preferred_shift, shift_type_id, time } = req.body;
    
    if (!user_id || !date) {
      return res.status(400).json({ error: 'user_id and date are required' });
    }
    
    // Check if user has approved leave on this date
    const leaveCheck = await pool.query(`
      SELECT s.id, s.title
      FROM public.shifts s
      WHERE s.user_id = $1 
        AND s.date = $2 
        AND s.title IS NOT NULL 
        AND s.shift_type_id IS NULL
        AND s.published = true
    `, [user_id, date]);
    
    if (leaveCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: `Cannot request shift on this date. You have an approved ${leaveCheck.rows[0].title} scheduled.` 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO public.shift_requests 
      (user_id, date, preferred_shift, shift_type_id, time, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [user_id, date, preferred_shift, shift_type_id, time]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating shift request:', error);
    res.status(500).json({ error: 'Failed to create shift request' });
  }
};

// Approve shift request
const approveShiftRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the shift request details
    const shiftRequest = await pool.query(`
      SELECT user_id, date
      FROM public.shift_requests
      WHERE id = $1
    `, [id]);
    
    if (shiftRequest.rows.length === 0) {
      return res.status(404).json({ error: 'Shift request not found' });
    }
    
    const { user_id, date } = shiftRequest.rows[0];
    
    // Check if user has approved leave on this date
    const leaveCheck = await pool.query(`
      SELECT s.id, s.title
      FROM public.shifts s
      WHERE s.user_id = $1 
        AND s.date = $2 
        AND s.title IS NOT NULL 
        AND s.shift_type_id IS NULL
        AND s.published = true
    `, [user_id, date]);
    
    if (leaveCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: `Cannot approve shift request. User has an approved ${leaveCheck.rows[0].title} on this date.` 
      });
    }
    
    const result = await pool.query(`
      UPDATE public.shift_requests 
      SET status = 'approved'
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error approving shift request:', error);
    res.status(500).json({ error: 'Failed to approve shift request' });
  }
};

// Reject shift request
const rejectShiftRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE public.shift_requests 
      SET status = 'rejected'
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shift request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error rejecting shift request:', error);
    res.status(500).json({ error: 'Failed to reject shift request' });
  }
};

// Delete shift request
const deleteShiftRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM public.shift_requests WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shift request not found' });
    }
    
    res.json({ message: 'Shift request deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift request:', error);
    res.status(500).json({ error: 'Failed to delete shift request' });
  }
};

module.exports = {
  getAllShiftRequests,
  getShiftRequestById,
  createShiftRequest,
  approveShiftRequest,
  rejectShiftRequest,
  deleteShiftRequest
};
