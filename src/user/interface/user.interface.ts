import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
  changePasswordAfter: (candidatePassword: number) => boolean;
  createPasswordResetToken: () => string;
}
