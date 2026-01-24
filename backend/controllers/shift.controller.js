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
        sr.id as shift_request_id,
        TO_CHAR(sr.date, 'YYYY-MM-DD') as date,
        sr.title,
        sr.start_time,
        sr.end_time,
        sr.status,
        sr.shift_type_id,
        st.name as shift_type_name,
        st.color_hex
      FROM users u
      INNER JOIN departments d ON u.department_id = d.id
      LEFT JOIN shift_requests sr ON u.id = sr.user_id AND sr.status IN ('pending', 'approved')
      LEFT JOIN shift_types st ON sr.shift_type_id = st.id
      WHERE u.role_id = 2
      ORDER BY d.name, u.last_name, u.first_name, sr.date
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
