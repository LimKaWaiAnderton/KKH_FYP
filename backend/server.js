import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import pool from './db/pool.js';
import leaveRouter from './routes/leave.route.js';
import authRoutes from "./routes/auth.route.js";
import shiftRoutes from "./routes/shift.route.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leaves', leaveRouter);
app.use('/api/shifts', shiftRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

