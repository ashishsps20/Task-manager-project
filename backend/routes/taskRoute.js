import express from 'express';
import authMiddleware from '../middleware/auth.js';

import {createTask, getAllTasks,getTaskById,updateTask,deleteTask,} from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.route('/gp')
   .get(authMiddleware, getAllTasks)
   .post(authMiddleware, createTask);

taskRouter.route('/:id/gp')
    .get(authMiddleware, getTaskById)
    .put(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

export default taskRouter;