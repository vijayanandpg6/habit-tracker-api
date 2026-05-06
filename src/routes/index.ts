import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import habitRoutes from './habit.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/habits', habitRoutes);

export { router as apiRouter, healthRoutes };
