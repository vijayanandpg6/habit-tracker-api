import { Request, Response } from 'express';
import { habitService } from '../services/habit.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const listHabits = asyncHandler(async (req: Request, res: Response) => {
  const habits = await habitService.listHabits(req.user!.userId);
  return sendSuccess(res, 'Habits retrieved', habits);
});

export const createHabit = asyncHandler(async (req: Request, res: Response) => {
  const habit = await habitService.createHabit(req.user!.userId, req.body);
  return sendCreated(res, 'Habit created successfully', habit);
});

export const updateHabit = asyncHandler(async (req: Request, res: Response) => {
  const habit = await habitService.updateHabit(req.params.id, req.user!.userId, req.body);
  return sendSuccess(res, 'Habit updated successfully', habit);
});

export const deleteHabit = asyncHandler(async (req: Request, res: Response) => {
  await habitService.deleteHabit(req.params.id, req.user!.userId);
  return sendSuccess(res, 'Habit deleted successfully');
});

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const habit = await habitService.checkIn(
    req.params.id,
    req.user!.userId,
    req.body.clientUpdatedAt as string,
  );
  return sendSuccess(res, 'Habit check-in recorded', habit);
});
