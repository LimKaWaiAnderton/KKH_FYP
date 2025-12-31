import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * POST /auth/login
 * Login user and return JWT
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const result = await pool.query(
      `SELECT id, email, password_hash, role_id
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // 2. Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Send token
    res.json({
      token,
      role: user.role_id === 1 ? "admin" : "employee",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /auth/me
 * Return logged-in user from token
 */
export const me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, email, role_id
       FROM users
       WHERE id = $1`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
