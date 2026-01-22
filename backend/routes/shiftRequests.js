const express = require('express');
const router = express.Router();
const shiftRequestController = require('../controllers/shiftRequestController');

// GET all shift requests (with optional filters)
router.get('/', shiftRequestController.getAllShiftRequests);

// GET shift request by ID
router.get('/:id', shiftRequestController.getShiftRequestById);

// POST create shift request
router.post('/', shiftRequestController.createShiftRequest);

// PUT approve shift request
router.put('/:id/approve', shiftRequestController.approveShiftRequest);

// PUT reject shift request
router.put('/:id/reject', shiftRequestController.rejectShiftRequest);

// DELETE shift request
router.delete('/:id', shiftRequestController.deleteShiftRequest);

module.exports = router;
