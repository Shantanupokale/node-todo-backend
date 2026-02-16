import express from 'express';
import {
    createTodo,
    getTodos,
    getTodobyId,
    updateTodo,
    deleteTodo
} from '../controllers/todo.controller.js';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodobyId);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;