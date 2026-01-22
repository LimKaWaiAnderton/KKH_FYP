const pool = require('../config/database');

// Get all leave requests
const getAllLeaveRequests = async (req, res) => {
  try {
    const { status, user_id } = req.query;
    
    let query = `
      SELECT 
        lr.id,
        lr.user_id,
        u.first_name,
        u.last_name,
        u.email,
        lr.leave_type_id,
        lt.name as leave_type,
        lr.start_date,
        lr.end_date,
        lr.total_days,
        lr.status,
        lr.applied_date,
        lr.created_at,
        lr.updated_at
      FROM public.leave_requests lr
      JOIN public.users u ON lr.user_id = u.id
      JOIN public.leave_types lt ON lr.leave_type_id = lt.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND lr.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (user_id) {
      query += ` AND lr.user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }
    
    query += ' ORDER BY lr.applied_date DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

// Get leave request by ID
const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        lr.id,
        lr.user_id,
        u.first_name,
        u.last_name,
        u.email,
        lr.leave_type_id,
        lt.name as leave_type,
        lr.start_date,
        lr.end_date,
        lr.total_days,
        lr.status,
        lr.applied_date,
        lr.created_at,
        lr.updated_at
      FROM public.leave_requests lr
      JOIN public.users u ON lr.user_id = u.id
      JOIN public.leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
};

// Create leave request
const createLeaveRequest = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, leave_type_id, start_date, end_date, total_days } = req.body;
    
    if (!user_id || !leave_type_id || !start_date || !end_date || !total_days) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check leave balance
    const balanceResult = await client.query(`
      SELECT remaining_days 
      FROM public.user_leave_balance 
      WHERE user_id = $1 AND leave_type_id = $2
    `, [user_id, leave_type_id]);
    
    if (balanceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Leave balance not found' });
    }
    
    if (balanceResult.rows[0].remaining_days < total_days) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Insufficient leave balance',
        remaining: balanceResult.rows[0].remaining_days,
        requested: total_days
      });
    }
    
    // Create leave request
    const result = await client.query(`
      INSERT INTO public.leave_requests 
      (user_id, leave_type_id, start_date, end_date, total_days, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [user_id, leave_type_id, start_date, end_date, total_days]);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  } finally {
    client.release();
  }
};

// Approve leave request
const approveLeaveRequest = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get leave request details
    const leaveResult = await client.query(
      'SELECT * FROM public.leave_requests WHERE id = $1',
      [id]
    );
    
    if (leaveResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    const leave = leaveResult.rows[0];
    
    if (leave.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Leave request is not pending',
        current_status: leave.status
      });
    }
    
    // Update leave balance
    await client.query(`
      UPDATE public.user_leave_balance 
      SET 
        used_days = used_days + $1,
        remaining_days = remaining_days - $1
      WHERE user_id = $2 AND leave_type_id = $3
    `, [leave.total_days, leave.user_id, leave.leave_type_id]);
    
    // Update leave request status
    const result = await client.query(`
      UPDATE public.leave_requests 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving leave request:', error);
    res.status(500).json({ error: 'Failed to approve leave request' });
  } finally {
    client.release();
  }
};

// Reject leave request
const rejectLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE public.leave_requests 
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    res.status(500).json({ error: 'Failed to reject leave request' });
  }
};

// Get user leave balance
const getUserLeaveBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        ulb.id,
        ulb.user_id,
        ulb.leave_type_id,
        lt.name as leave_type,
        ulb.used_days,
        ulb.remaining_days,
        ulb.total_quota,
        ulb.created_at
      FROM public.user_leave_balance ulb
      JOIN public.leave_types lt ON ulb.leave_type_id = lt.id
      WHERE ulb.user_id = $1
      ORDER BY lt.name
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
};

module.exports = {
  getAllLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getUserLeaveBalance
};
