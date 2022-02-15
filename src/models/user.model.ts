import createError from 'http-errors';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { hash, compare } from 'bcrypt';
import { IsAlpha, IsEmail, IsString, MinLength } from 'class-validator';

import UserRole from '@enums/user-role.enum';
import BaseModel from '@models/base.model';

@pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
})
export class User extends BaseModel {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @IsString({ message: 'Name is not correct' })
  @IsAlpha(undefined, { message: 'Name is not correct' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @prop({ required: true, unique: true })
  name: string;

  @IsEmail(undefined, { message: 'Email is not correct' })
  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @prop({ required: true })
  password: string;

  @prop({
    required: true,
    default: 'Bangaon', // remove this line in production
  })
  address: string;

  @prop({ required: true, default: false })
  isAdmin: boolean;

  @prop({
    required: true,
    type: [String],
    enum: [UserRole],
    default: [UserRole.SELLS_OPERATOR], // remove this line in production
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

export default getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
