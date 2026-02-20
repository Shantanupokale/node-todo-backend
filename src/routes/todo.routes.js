import express from 'express';
import { auth } from '../middleware/authmiddleware.js';
import {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    toggleBookmark
} from '../controllers/todo.controller.js';

const router = express.Router();

router.post('/', auth, createTodo);
router.get('/', auth, getTodos);
router.get('/:id', auth, getTodoById);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);
router.patch("/:id/bookmark", auth, toggleBookmark);

// router.post('/', createTodo);
// router.get('/', getTodos);
// router.get('/:id', getTodoById);
// router.put('/:id', updateTodo);
// router.delete('/:id', deleteTodo);
// router.patch("/:id/bookmark", toggleBookmark);

export default router;