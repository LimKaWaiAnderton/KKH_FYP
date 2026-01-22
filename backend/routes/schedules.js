const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// GET all schedules (with optional filters)
router.get('/', scheduleController.getAllSchedules);

// GET schedules by date range (for schedule grid)
router.get('/range', scheduleController.getSchedulesByDateRange);

// GET schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// POST create new schedule
router.post('/', scheduleController.createSchedule);

// PUT publish schedule
router.put('/:id/publish', scheduleController.publishSchedule);

// DELETE schedule
router.delete('/:id', scheduleController.deleteSchedule);

// Nurse schedule assignments
router.post('/nurses', scheduleController.addNurseToSchedule);
router.put('/nurses/:id', scheduleController.updateNurseSchedule);
router.delete('/nurses/:id', scheduleController.removeNurseFromSchedule);

module.exports = router;
