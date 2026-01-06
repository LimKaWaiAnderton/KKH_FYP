import express from "express";
import { login, me } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login
router.post("/login", login);

// Get logged-in user (protected)
router.get("/me", auth, me);

export default router;
