import { Router } from 'express';
import * as habitController from '../controllers/habit.controller';
import {
  createHabitValidator,
  updateHabitValidator,
  habitIdValidator,
  checkInValidator,
} from '../validators/habit.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', habitController.listHabits);
router.post('/', createHabitValidator, validate, habitController.createHabit);
router.patch('/:id', updateHabitValidator, validate, habitController.updateHabit);
router.delete('/:id', habitIdValidator, validate, habitController.deleteHabit);
router.post('/:id/check-in', checkInValidator, validate, habitController.checkIn);

export default router;
