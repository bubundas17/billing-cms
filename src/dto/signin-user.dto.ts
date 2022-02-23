import { IsOptional, IsString, MinLength } from 'class-validator';

class SignInUserDto {
  @IsString({ message: 'Username is not correct' })
  @MinLength(3, {
    message: 'Username must be at least 3 characters long',
  })
  @IsOptional()
  username: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export default SignInUserDto;
