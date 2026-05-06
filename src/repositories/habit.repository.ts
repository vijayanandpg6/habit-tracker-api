import { Types } from 'mongoose';
import { IHabit, Habit } from '../models/habit.model';

export const habitRepository = {
  findAllByUser: (userId: string) =>
    Habit.find({ userId: new Types.ObjectId(userId), deletedAt: null }).sort({ updatedAt: -1 }),

  findById: (id: string, userId: string) =>
    Habit.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null }),

  create: (data: Pick<IHabit, 'userId' | 'title' | 'description' | 'clientUpdatedAt'>) =>
    Habit.create(data),

  update: (id: string, userId: string, data: Partial<IHabit>) =>
    Habit.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null },
      { ...data, updatedAt: new Date() },
      { new: true },
    ),

  softDelete: (id: string, userId: string) =>
    Habit.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    ),
};
