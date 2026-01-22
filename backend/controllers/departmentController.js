const pool = require('../config/database');

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.departments ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM public.departments WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO public.departments (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating department:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Department name already exists' });
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const result = await pool.query(
      'UPDATE public.departments SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM public.departments WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
