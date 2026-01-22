const pool = require('../config/database');

// Get all schedules
const getAllSchedules = async (req, res) => {
  try {
    const { department_id, start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        s.id, 
        s.date, 
        s.department_id,
        d.name as department_name,
        s.published,
        s.created_at
      FROM public.schedules s
      JOIN public.departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;
    
    if (department_id) {
      query += ` AND s.department_id = $${paramCount}`;
      params.push(department_id);
      paramCount++;
    }
    
    if (start_date) {
      query += ` AND s.date >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }
    
    if (end_date) {
      query += ` AND s.date <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }
    
    query += ' ORDER BY s.date DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

// Get schedule by ID with nurse assignments
const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get schedule info
    const scheduleResult = await pool.query(`
      SELECT 
        s.id, 
        s.date, 
        s.department_id,
        d.name as department_name,
        s.published,
        s.created_at
      FROM public.schedules s
      JOIN public.departments d ON s.department_id = d.id
      WHERE s.id = $1
    `, [id]);
    
    if (scheduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    // Get nurse assignments
    const nursesResult = await pool.query(`
      SELECT 
        ns.id,
        ns.user_id,
        u.first_name,
        u.last_name,
        ns.shift_type_id,
        st.name as shift_type_name,
        st.color_hex
      FROM public.nurse_schedule ns
      JOIN public.users u ON ns.user_id = u.id
      JOIN public.shift_types st ON ns.shift_type_id = st.id
      WHERE ns.schedule_id = $1
      ORDER BY u.last_name, u.first_name
    `, [id]);
    
    const schedule = {
      ...scheduleResult.rows[0],
      nurses: nursesResult.rows
    };
    
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

// Get schedules for a date range (for schedule grid view)
const getSchedulesByDateRange = async (req, res) => {
  try {
    const { department_id, start_date, end_date } = req.query;
    
    if (!department_id || !start_date || !end_date) {
      return res.status(400).json({ 
        error: 'department_id, start_date, and end_date are required' 
      });
    }
    
    const result = await pool.query(`
      SELECT 
        s.id as schedule_id,
        s.date,
        s.published,
        ns.user_id,
        u.first_name,
        u.last_name,
        u.department_id,
        d.name as department_name,
        ns.shift_type_id,
        st.name as shift_type,
        st.color_hex
      FROM public.schedules s
      LEFT JOIN public.nurse_schedule ns ON s.id = ns.schedule_id
      LEFT JOIN public.users u ON ns.user_id = u.id
      LEFT JOIN public.departments d ON u.department_id = d.id
      LEFT JOIN public.shift_types st ON ns.shift_type_id = st.id
      WHERE s.department_id = $1 
        AND s.date >= $2 
        AND s.date <= $3
      ORDER BY s.date, u.last_name, u.first_name
    `, [department_id, start_date, end_date]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules by date range:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

// Create new schedule
const createSchedule = async (req, res) => {
  try {
    const { date, department_id, published = false } = req.body;
    
    if (!date || !department_id) {
      return res.status(400).json({ error: 'Date and department_id are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO public.schedules (date, department_id, published)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [date, department_id, published]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating schedule:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ 
        error: 'Schedule already exists for this date and department' 
      });
    }
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

// Publish schedule
const publishSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE public.schedules 
      SET published = true 
      WHERE id = $1 
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error publishing schedule:', error);
    res.status(500).json({ error: 'Failed to publish schedule' });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // This will cascade delete nurse_schedule entries
    const result = await pool.query(
      'DELETE FROM public.schedules WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

// Add nurse to schedule
const addNurseToSchedule = async (req, res) => {
  try {
    const { schedule_id, user_id, shift_type_id } = req.body;
    
    if (!schedule_id || !user_id || !shift_type_id) {
      return res.status(400).json({ 
        error: 'schedule_id, user_id, and shift_type_id are required' 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO public.nurse_schedule (schedule_id, user_id, shift_type_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [schedule_id, user_id, shift_type_id]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding nurse to schedule:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ 
        error: 'Nurse already assigned to this schedule' 
      });
    }
    res.status(500).json({ error: 'Failed to add nurse to schedule' });
  }
};

// Update nurse shift in schedule
const updateNurseSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { shift_type_id } = req.body;
    
    const result = await pool.query(`
      UPDATE public.nurse_schedule 
      SET shift_type_id = $1 
      WHERE id = $2 
      RETURNING *
    `, [shift_type_id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nurse schedule entry not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating nurse schedule:', error);
    res.status(500).json({ error: 'Failed to update nurse schedule' });
  }
};

// Remove nurse from schedule
const removeNurseFromSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM public.nurse_schedule WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nurse schedule entry not found' });
    }
    
    res.json({ message: 'Nurse removed from schedule successfully' });
  } catch (error) {
    console.error('Error removing nurse from schedule:', error);
    res.status(500).json({ error: 'Failed to remove nurse from schedule' });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getSchedulesByDateRange,
  createSchedule,
  publishSchedule,
  deleteSchedule,
  addNurseToSchedule,
  updateNurseSchedule,
  removeNurseFromSchedule
};
