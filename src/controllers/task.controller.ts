import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.listTasks(req.user!.userId);
  return sendSuccess(res, 'Tasks retrieved', tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.user!.userId, req.body);
  return sendCreated(res, 'Task created successfully', task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.params.id, req.user!.userId, req.body);
  return sendSuccess(res, 'Task updated successfully', task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id, req.user!.userId);
  return sendSuccess(res, 'Task deleted successfully');
});
