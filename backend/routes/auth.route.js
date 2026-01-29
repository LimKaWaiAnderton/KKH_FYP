import express from "express";
import { login, me, addUser, deleteUser, getAllUsers, updateUserRole, updateUser } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login
router.post("/login", login);

// Get logged-in user (protected)
router.get("/me", auth, me);

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
