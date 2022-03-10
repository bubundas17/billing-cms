import { IsEmail, IsEmpty } from 'class-validator';

class EmailDto {
  @IsEmail(undefined, { message: 'Email is not correct' })
  @IsEmpty({ message: 'Email is required' })
  email: string;
}

export default EmailDto;
