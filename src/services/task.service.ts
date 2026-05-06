import { Types } from 'mongoose';
import { taskRepository } from '../repositories/task.repository';
import { NotFoundError, BadRequestError } from '../utils/appError';

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  clientUpdatedAt: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  clientUpdatedAt: string;
}

export const taskService = {
  listTasks: async (userId: string) => taskRepository.findAllByUser(userId),

  createTask: async (userId: string, dto: CreateTaskDto) => {
    const clientUpdatedAt = new Date(dto.clientUpdatedAt);
    if (isNaN(clientUpdatedAt.getTime())) {
      throw new BadRequestError('Invalid clientUpdatedAt timestamp');
    }

    return taskRepository.create({
      userId: new Types.ObjectId(userId) as unknown as Types.ObjectId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      completed: dto.completed ?? false,
      clientUpdatedAt,
    });
  },

  updateTask: async (id: string, userId: string, dto: UpdateTaskDto) => {
    const clientUpdatedAt = new Date(dto.clientUpdatedAt);
    if (isNaN(clientUpdatedAt.getTime())) {
      throw new BadRequestError('Invalid clientUpdatedAt timestamp');
    }

    const existing = await taskRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Task');

    // Last-write-wins: only apply if client's timestamp is newer
    if (clientUpdatedAt <= existing.clientUpdatedAt) {
      return existing;
    }

    const updated = await taskRepository.update(id, userId, {
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : existing.dueDate,
      completed: dto.completed ?? existing.completed,
      clientUpdatedAt,
    });

    return updated ?? existing;
  },

  deleteTask: async (id: string, userId: string) => {
    const task = await taskRepository.softDelete(id, userId);
    if (!task) throw new NotFoundError('Task');
    return task;
  },
};
