import { Types } from 'mongoose';
import { habitRepository } from '../repositories/habit.repository';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/appError';

export interface CreateHabitDto {
  title: string;
  description?: string;
  clientUpdatedAt: string;
}

export interface UpdateHabitDto {
  title?: string;
  description?: string;
  clientUpdatedAt: string;
}

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isConsecutiveDay = (last: Date, now: Date): boolean => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime() - lastDay.getTime() === oneDayMs;
};

export const habitService = {
  listHabits: async (userId: string) => habitRepository.findAllByUser(userId),

  createHabit: async (userId: string, dto: CreateHabitDto) => {
    const clientUpdatedAt = new Date(dto.clientUpdatedAt);
    if (isNaN(clientUpdatedAt.getTime())) {
      throw new BadRequestError('Invalid clientUpdatedAt timestamp');
    }

    return habitRepository.create({
      userId: new Types.ObjectId(userId) as unknown as Types.ObjectId,
      title: dto.title,
      description: dto.description,
      clientUpdatedAt,
    });
  },

  updateHabit: async (id: string, userId: string, dto: UpdateHabitDto) => {
    const clientUpdatedAt = new Date(dto.clientUpdatedAt);
    if (isNaN(clientUpdatedAt.getTime())) {
      throw new BadRequestError('Invalid clientUpdatedAt timestamp');
    }

    const existing = await habitRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Habit');

    if (clientUpdatedAt <= existing.clientUpdatedAt) {
      return existing;
    }

    const updated = await habitRepository.update(id, userId, {
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      clientUpdatedAt,
    });

    return updated ?? existing;
  },

  deleteHabit: async (id: string, userId: string) => {
    const habit = await habitRepository.softDelete(id, userId);
    if (!habit) throw new NotFoundError('Habit');
    return habit;
  },

  checkIn: async (id: string, userId: string, clientUpdatedAt: string) => {
    const now = new Date(clientUpdatedAt);
    if (isNaN(now.getTime())) {
      throw new BadRequestError('Invalid clientUpdatedAt timestamp');
    }

    const habit = await habitRepository.findById(id, userId);
    if (!habit) throw new NotFoundError('Habit');

    // Idempotent: ignore duplicate same-day check-ins
    if (habit.lastCompletedAt && isSameDay(habit.lastCompletedAt, now)) {
      throw new ConflictError('Habit already checked in today');
    }

    const streakCount =
      habit.lastCompletedAt && isConsecutiveDay(habit.lastCompletedAt, now)
        ? habit.streakCount + 1
        : 1;

    const updated = await habitRepository.update(id, userId, {
      lastCompletedAt: now,
      streakCount,
      completionHistory: [...habit.completionHistory, now],
      clientUpdatedAt: now,
    });

    return updated ?? habit;
  },
};
