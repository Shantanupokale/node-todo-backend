import express from "express";
import { auth } from "../middleware/authmiddleware.js";
import {
  createSubtask,
  getSubtasksByTodo,
  updateSubtask,
  deleteSubtask,
} from "../controllers/subtask.controller.js";

const router = express.Router();

router.post("/", auth, createSubtask);
router.get("/:todo_id", auth, getSubtasksByTodo);
router.put("/:id", auth, updateSubtask);
router.delete("/:id", auth, deleteSubtask);

export default router;
