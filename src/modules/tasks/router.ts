import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "./controller";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/:id", getTaskById);

export default router;
