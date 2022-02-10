import { compare, hash } from 'bcrypt';
import createError from 'http-errors';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';

import UserRole from '@enums/user-role.enum';
import { Document } from 'mongoose';

@pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
})
export class UserSchema {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: false })
  address: string;

  @prop({ required: true, default: false })
  isAdmin: boolean;

  @prop({
    required: true,
    type: [String],
    enum: [UserRole],
  })
  roles: string[];

  async isValidPassword(password: string): Promise<boolean | never> {
    try {
      return await compare(password, this.password);
    } catch (error) {
      throw new createError.InternalServerError(error.message);
    }
  }
}

export type User = UserSchema & Document;

export default getModelForClass(UserSchema, {
  schemaOptions: { timestamps: true },
});
