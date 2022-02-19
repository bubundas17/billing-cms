import { MinLength } from 'class-validator';

import { Match } from '@decorators/match.decorator';

class PasswordDto {
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  repeatPassword: string;
}

export default PasswordDto;
