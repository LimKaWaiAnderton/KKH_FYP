import express from "express";
import {
  getMyShiftRequests,
  createShiftRequest,
  createShiftForEmployee,
  getShiftTypes,
  getAllUsersWithPendingShifts,
  approveShiftRequest,
  rejectShiftRequest,
  publishSchedule,
  getAllEmployeesWithPublishedShifts
} from "../controllers/shift.controller.js";
import auth from "../middlewares/auth.middleware.js";

const shiftRoutes = express.Router();

shiftRoutes.get("/", auth, getMyShiftRequests);
shiftRoutes.post("/", auth, createShiftRequest);
shiftRoutes.post("/create-for-employee", auth, createShiftForEmployee);
shiftRoutes.get("/types", auth, getShiftTypes);
shiftRoutes.get("/users-with-pending", auth, getAllUsersWithPendingShifts);
shiftRoutes.get("/employees-with-published", auth, getAllEmployeesWithPublishedShifts);
shiftRoutes.patch("/:requestId/approve", auth, approveShiftRequest);
shiftRoutes.patch("/:requestId/reject", auth, rejectShiftRequest);
shiftRoutes.post("/publish", auth, publishSchedule);

export default shiftRoutes;
