import { Router } from 'express';
import mockAuth from '../middlewares/mockAuth.js';

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
leaveRouter.get('/', mockAuth, getLeaveRequests);

// User
leaveRouter.get('/balance', mockAuth, getLeaveBalance);
leaveRouter.get('/types', mockAuth, getLeaveType);
leaveRouter.post('/', mockAuth, applyLeave);

// Admin
leaveRouter.get('/:id', mockAuth, getLeaveRequestById);

leaveRouter.patch('/:id', mockAuth, manageLeaveRequest);

export default leaveRouter;