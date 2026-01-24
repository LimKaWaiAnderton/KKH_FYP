import express from "express";
import {
  getMyShiftRequests,
  createShiftRequest,
  getShiftTypes,
  getAllUsersWithPendingShifts,
  approveShiftRequest,
  rejectShiftRequest,
  publishSchedule
} from "../controllers/shift.controller.js";
import auth from "../middlewares/auth.middleware.js";

const shiftRoutes = express.Router();

shiftRoutes.get("/", auth, getMyShiftRequests);
shiftRoutes.post("/", auth, createShiftRequest);
shiftRoutes.get("/types", auth, getShiftTypes);
shiftRoutes.get("/users-with-pending", auth, getAllUsersWithPendingShifts);
shiftRoutes.patch("/:requestId/approve", auth, approveShiftRequest);
shiftRoutes.patch("/:requestId/reject", auth, rejectShiftRequest);
shiftRoutes.post("/publish", auth, publishSchedule);

export default shiftRoutes;
