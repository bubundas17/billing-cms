import { prop } from '@typegoose/typegoose';
import { IsAlpha, IsEmail, IsString, MinLength } from 'class-validator';

import { Match } from '@decorators/match.decorator';

class CreateUserDto {
  @IsString({ message: 'Name is not correct' })
  @IsAlpha(undefined, { message: 'Name is not correct' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @prop({ required: true, unique: true })
  name: string;

  @IsString({ message: 'Username is not correct' })
  @IsAlpha(undefined, { message: 'Username is not correct' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @prop({ required: true, unique: true })
  username: string;

  @IsEmail(undefined, { message: 'Email is not correct' })
  @prop({ required: true, unique: true, lowercase: true })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @prop({ required: true })
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  repeatPassword: string;
}

export default CreateUserDto;
