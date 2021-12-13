import mongoose from 'mongoose';
import { compare, hash } from 'bcrypt';
import createError from 'http-errors';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    adminRole: { type: String }, // admin, superAdmin, seelsOperator
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw createError.InternalServerError(error.message);
  }
};

export default mongoose.model('User', UserSchema);
