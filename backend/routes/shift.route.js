import express from "express";
import {
  getMyShiftRequests,
  createShiftRequest,
  getShiftTypes,
  getAllUsersWithPendingShifts
} from "../controllers/shift.controller.js";
import auth from "../middlewares/auth.middleware.js";

const shiftRoutes = express.Router();

shiftRoutes.get("/", auth, getMyShiftRequests);
shiftRoutes.post("/", auth, createShiftRequest);
shiftRoutes.get("/types", auth, getShiftTypes);
shiftRoutes.get("/users-with-pending", auth, getAllUsersWithPendingShifts);

export default shiftRoutes;
