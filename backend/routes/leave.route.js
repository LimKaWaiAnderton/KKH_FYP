import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';

import {
    getLeaveRequests,
    getLeaveBalance,
    getLeaveType,
    applyLeave,
    getLeaveRequestById,
    manageLeaveRequest,
    updateUserLeaveBalance
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
leaveRouter.patch('/balance/:userId', auth, updateUserLeaveBalance);

export default leaveRouter;