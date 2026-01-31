import express from 'express';
import { generateRoster } from '../controllers/autoSchedule.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/auto-schedule/generate - Generate roster for date range
router.post('/generate', auth, generateRoster);

export default router;