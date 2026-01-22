const pool = require('../config/database');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.department_id,
        d.name as department_name,
        u.role_id,
        r.name as role_name,
        u.created_at
      FROM public.users u
      JOIN public.departments d ON u.department_id = d.id
      JOIN public.roles r ON u.role_id = r.id
      ORDER BY u.last_name, u.first_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.department_id,
        d.name as department_name,
        u.role_id,
        r.name as role_name,
        u.created_at
      FROM public.users u
      JOIN public.departments d ON u.department_id = d.id
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Get users by department
const getUsersByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.email, 
        u.department_id,
        d.name as department_name,
        u.role_id,
        r.name as role_name,
        u.created_at
      FROM public.users u
      JOIN public.departments d ON u.department_id = d.id
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.department_id = $1
      ORDER BY u.last_name, u.first_name
    `, [departmentId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users by department:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, department_id, role_id, password } = req.body;
    
    if (!first_name || !last_name || !email || !department_id || !role_id || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(`
      INSERT INTO public.users 
      (first_name, last_name, email, department_id, role_id, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name, last_name, email, department_id, role_id, created_at
    `, [first_name, last_name, email, department_id, role_id, password_hash]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, department_id, role_id } = req.body;
    
    const result = await pool.query(`
      UPDATE public.users 
      SET first_name = $1, last_name = $2, email = $3, department_id = $4, role_id = $5
      WHERE id = $6
      RETURNING id, first_name, last_name, email, department_id, role_id, created_at
    `, [first_name, last_name, email, department_id, role_id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM public.users WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByDepartment,
  createUser,
  updateUser,
  deleteUser
};
