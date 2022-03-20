import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { hash } from 'bcrypt';

import UserRole from '@enums/user-role.enum';
import BaseModel from '@models/base.model';
import AppError from '@exceptions/AppError';

@pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (err) {
    next(err as AppError);
  }
})
export class User extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  username: string;

  @prop()
  phone: string;

  @prop()
  company: string;

  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop()
  address: string;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({
    type: [String],
    enum: [UserRole],
    default: [UserRole.SELLS_OPERATOR],
  })
  roles: string[];
}

export default getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
