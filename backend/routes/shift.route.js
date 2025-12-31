import express from "express";
import {
  getMyShiftRequests,
  createShiftRequest,
  getShiftTypes
} from "../controllers/shift.controller.js";
import auth from "../middlewares/auth.js";

const shiftRoutes = express.Router();

shiftRoutes.get("/", auth, getMyShiftRequests);
shiftRoutes.post("/", auth, createShiftRequest);
shiftRoutes.get("/types", auth, getShiftTypes);

export default shiftRoutes;
