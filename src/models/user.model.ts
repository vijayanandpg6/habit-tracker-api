import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { BCRYPT_ROUNDS } from '../constants';

export interface IUser extends Document {
  email: string;
  password: string;
  isEmailVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      select: false,
    },
    verificationTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
