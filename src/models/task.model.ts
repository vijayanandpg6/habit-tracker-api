import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  clientUpdatedAt: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    clientUpdatedAt: {
      type: Date,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

taskSchema.index({ userId: 1, deletedAt: 1 });
taskSchema.index({ userId: 1, updatedAt: -1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
