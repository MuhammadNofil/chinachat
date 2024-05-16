import validator from 'validator';
import { Schema } from 'mongoose';
import { hash } from 'bcrypt';
import { compare } from 'bcryptjs';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      index: true,
    },
    otp: Number,
  },
  { timestamps: true },
);

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export { UserSchema };
