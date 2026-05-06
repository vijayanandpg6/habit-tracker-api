import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IHabit extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  streakCount: number;
  lastCompletedAt?: Date;
  completionHistory: Date[];
  clientUpdatedAt: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
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
    streakCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastCompletedAt: {
      type: Date,
      default: null,
    },
    completionHistory: {
      type: [Date],
      default: [],
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

habitSchema.index({ userId: 1, deletedAt: 1 });
habitSchema.index({ userId: 1, updatedAt: -1 });

export const Habit = mongoose.model<IHabit>('Habit', habitSchema);
