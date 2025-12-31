import { Router } from 'express';
import auth from '../middlewares/auth.js';

import {
    getLeaveRequests,
    getLeaveBalance,
    getLeaveType,
    applyLeave,
    getLeaveRequestById,
    manageLeaveRequest
} from '../controllers/leave.controller.js';

const leaveRouter = Router();

// User & Admin
leaveRouter.get('/', auth, getLeaveRequests);

// User
leaveRouter.get('/balance', auth, getLeaveBalance);
leaveRouter.get('/types', auth, getLeaveType);
leaveRouter.post('/', auth, applyLeave);

// Admin
leaveRouter.get('/:id', auth, getLeaveRequestById);

leaveRouter.patch('/:id', auth, manageLeaveRequest);

export default leaveRouter;