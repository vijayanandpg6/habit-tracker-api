import { Types } from 'mongoose';
import { ITask, Task } from '../models/task.model';

export const taskRepository = {
  findAllByUser: (userId: string) =>
    Task.find({ userId: new Types.ObjectId(userId), deletedAt: null }).sort({ updatedAt: -1 }),

  findById: (id: string, userId: string) =>
    Task.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null }),

  create: (data: Pick<ITask, 'userId' | 'title' | 'description' | 'dueDate' | 'completed' | 'clientUpdatedAt'>) =>
    Task.create(data),

  update: (id: string, userId: string, data: Partial<ITask>) =>
    Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null },
      { ...data, updatedAt: new Date() },
      { new: true },
    ),

  softDelete: (id: string, userId: string) =>
    Task.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    ),
};
