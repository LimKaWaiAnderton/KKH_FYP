import pool from "../db/pool.js";

/* =========================
   GET MY SHIFT REQUESTS
   ========================= */
export const getMyShiftRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
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
    const { date, preferred_shift, time, shift_type_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO shift_requests
      (user_id, date, preferred_shift, time, shift_type_id, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
      `,
      [userId, date, preferred_shift, time, shift_type_id ?? null]
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
