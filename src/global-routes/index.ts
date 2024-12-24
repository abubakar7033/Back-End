import express from "express";
import tasksRouter from "../modules/tasks/router";

const router = express.Router();
router.use("/tasks", tasksRouter);

export default router;
