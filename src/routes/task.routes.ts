import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
} from '../validators/task.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', taskController.listTasks);
router.post('/', createTaskValidator, validate, taskController.createTask);
router.patch('/:id', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:id', taskIdValidator, validate, taskController.deleteTask);

export default router;
