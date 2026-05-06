import { FilterQuery } from 'mongoose';
import { IUser, User } from '../models/user.model';

export const userRepository = {
  findByEmail: (email: string) =>
    User.findOne({ email }).select('+password +verificationToken +verificationTokenExpiresAt'),

  findById: (id: string) => User.findById(id),

  findOne: (filter: FilterQuery<IUser>) => User.findOne(filter),

  create: (data: Pick<IUser, 'email' | 'password' | 'verificationToken' | 'verificationTokenExpiresAt'>) =>
    User.create(data),

  update: (id: string, data: Partial<IUser>) =>
    User.findByIdAndUpdate(id, data, { new: true }),

  markVerified: (id: string) =>
    User.findByIdAndUpdate(
      id,
      { isEmailVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
      { new: true },
    ),
};
