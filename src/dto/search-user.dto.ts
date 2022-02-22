import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

class SearchUserDto {
  @IsString({ message: 'Name is not correct' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsEmail(undefined, { message: 'Email is not correct' })
  email: string;

  @IsString({ message: 'Company is not correct' })
  @MinLength(3, { message: 'Company must be at least 3 characters long' })
  company: string;

  @IsPhoneNumber(undefined, { message: 'Phone number is not correct' })
  phone: string;
}

export default SearchUserDto;
