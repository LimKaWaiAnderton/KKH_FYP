import pool from "../db/pool.js";

/* =========================
   GET MY SHIFT REQUESTS
   ========================= */
export const getMyShiftRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        id,
        user_id,
        TO_CHAR(date, 'YYYY-MM-DD') as date,
        title,
        status,
        shift_type_id,
        start_time,
        end_time,
        COALESCE(published, false) as published,
        created_at
      FROM shift_requests
      WHERE user_id = $1
      ORDER BY date ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch shifts" });
  }
};

/* =========================
   CREATE SHIFT REQUEST
   ========================= */
export const createShiftRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, title, start_time, end_time, shift_type_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO shift_requests
      (user_id, date, title, start_time, end_time, shift_type_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
      `,
      [userId, date, title ?? null, start_time ?? null, end_time ?? null, shift_type_id ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create shift request" });
  }
};

/* =========================
   CREATE SHIFT FOR EMPLOYEE (MANAGER)
   ========================= */
export const createShiftForEmployee = async (req, res) => {
  try {
    const { user_id, date, title, start_time, end_time, shift_type_id, color_hex } = req.body;

    // Manager creates a shift for an employee (saved as draft by default)
    const result = await pool.query(
      `
      INSERT INTO shifts
      (user_id, date, title, start_time, end_time, shift_type_id, color_hex, published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *
      `,
      [user_id, date, title ?? null, start_time ?? null, end_time ?? null, shift_type_id ?? null, color_hex ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create shift for employee" });
  }
};

/* =========================
   GET SHIFT TYPES
   ========================= */
export const getShiftTypes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM shift_types ORDER BY id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load shift types" });
  }
};

/* =========================
   GET ALL USERS WITH PENDING SHIFTS (FOR MANAGER)
   ========================= */
export const getAllUsersWithPendingShifts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        d.id as department_id,
        d.name as department_name,
        s.id as shift_id,
        TO_CHAR(s.date, 'YYYY-MM-DD') as date,
        COALESCE(s.title, st.name) as title,
        s.start_time,
        s.end_time,
        s.published,
        s.shift_type_id,
        st.name as shift_type_name,
        COALESCE(s.color_hex, st.color_hex) as color_hex
      FROM users u
      INNER JOIN departments d ON u.department_id = d.id
      LEFT JOIN shifts s ON u.id = s.user_id
      LEFT JOIN shift_types st ON s.shift_type_id = st.id
      WHERE u.role_id = 2
      ORDER BY d.name, u.last_name, u.first_name, s.date
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users with shifts" });
  }
};

/* =========================
   APPROVE SHIFT REQUEST
   ========================= */
export const approveShiftRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const result = await pool.query(
      `
      UPDATE shift_requests
      SET status = 'approved'
      WHERE id = $1
      RETURNING *
      `,
      [requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Shift request not found" });
    }

    res.json({ message: "Shift request approved", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve shift request" });
  }
};

/* =========================
   REJECT SHIFT REQUEST
   ========================= */
export const rejectShiftRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const result = await pool.query(
      `
      UPDATE shift_requests
      SET status = 'rejected'
      WHERE id = $1
      RETURNING *
      `,
      [requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Shift request not found" });
    }

    res.json({ message: "Shift request rejected", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject shift request" });
  }
};

/* =========================
   PUBLISH SCHEDULE
   ========================= */
export const publishSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Update all unpublished shifts within the date range to published
    const result = await pool.query(
      `
      UPDATE shifts
      SET published = true
      WHERE published = false
        AND date >= $1
        AND date <= $2
      RETURNING *
      `,
      [startDate, endDate]
    );

    res.json({ 
      message: "Schedule published successfully", 
      publishedCount: result.rows.length 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to publish schedule" });
  }
};

/* =========================
   GET ALL EMPLOYEES WITH PUBLISHED SHIFTS (FOR EMPLOYEE VIEW)
   ========================= */
export const getAllEmployeesWithPublishedShifts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        d.id as department_id,
        d.name as department_name,
        s.id as shift_id,
        TO_CHAR(s.date, 'YYYY-MM-DD') as date,
        COALESCE(s.title, st.name) as title,
        s.start_time,
        s.end_time,
        s.published,
        s.shift_type_id,
        st.name as shift_type_name,
        COALESCE(s.color_hex, st.color_hex) as color_hex
      FROM users u
      INNER JOIN departments d ON u.department_id = d.id
      LEFT JOIN shifts s ON u.id = s.user_id AND s.published = true
      LEFT JOIN shift_types st ON s.shift_type_id = st.id
      WHERE u.role_id = 2
      ORDER BY d.name, u.last_name, u.first_name, s.date
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employees with published shifts" });
  }
};
