import express from "express";
import { login, me, addUser, deleteUser, getAllUsers, updateUserRole, forgotPassword, resetPassword, updateUser, getUserById } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login
router.post("/login", login);

// Forgot Password (no auth required)
router.post("/forgot-password", forgotPassword);

// Reset Password (no auth required)
router.post("/reset-password", resetPassword);

// Get logged-in user (protected)
router.get("/me", auth, me);

// Get user by ID (protected)
router.get("/user/:id", auth, getUserById);

// Get all users - for Team List (protected)
router.get("/users", auth, getAllUsers);

//Add User
router.post("/add-user", auth, addUser);

//Delete User
router.patch("/delete-user/:id", auth, deleteUser);

//Update User Role
router.patch("/update-role/:id", auth, updateUserRole);

//Update User Information
router.patch("/update-user/:id", auth, updateUser);

export default router;
