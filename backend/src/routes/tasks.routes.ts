import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks  (supports ?projectId, ?status, ?priority, ?assignedToId)
router.get('/', getTasks);

// POST /api/tasks
router.post('/', validate(createTaskSchema), createTask);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// PUT /api/tasks/:id
router.put('/:id', validate(updateTaskSchema), updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
