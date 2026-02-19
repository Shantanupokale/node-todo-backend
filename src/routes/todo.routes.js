import express from 'express';
import {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    toggleBookmark
} from '../controllers/todo.controller.js';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.patch("/:id/bookmark", toggleBookmark);

export default router;