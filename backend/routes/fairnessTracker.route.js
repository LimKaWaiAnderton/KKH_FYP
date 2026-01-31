import express from "express";
import { fairnessTracker } from "../controllers/fairnessTracker.controller.js";

const router = express.Router();

router.post("/fairness-tracker", fairnessTracker);

export default router;
