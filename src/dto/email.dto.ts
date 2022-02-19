import { IsEmail } from 'class-validator';

class EmailDto {
  @IsEmail(undefined, { message: 'Email is not correct' })
  email: string;
}

export default EmailDto;
