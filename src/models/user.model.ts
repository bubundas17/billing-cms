import createError from 'http-errors';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { hash, compare } from 'bcrypt';

import UserRole from '@enums/user-role.enum';
import BaseModel from '@models/base.model';
import HttpException from '@exceptions/HttpException';

@pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (err) {
    const error = err as HttpException;
    next(error);
  }
})
export class User extends BaseModel {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: false })
  address: string;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({
    required: true,
    type: [String],
    enum: [UserRole],
    default: [UserRole.SELLS_OPERATOR],
  })
  roles: string[];

  async isValidPassword(password: string): Promise<boolean | never> {
    try {
      return await compare(password, this.password);
    } catch (err) {
      const error = err as HttpException;
      throw new createError.InternalServerError(error.message);
    }
  }
}

export default getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
