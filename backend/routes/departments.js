import express from 'express';
import { 
  getAllDepartments, 
  getDepartmentById, 
} from '../controllers/departmentController.js';

const router = express.Router();

// GET all departments
router.get('/', getAllDepartments);

// GET department by ID
router.get('/:id', getDepartmentById);

export default router;
