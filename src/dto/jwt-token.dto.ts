import { IsJWT } from 'class-validator';

class JwtTokenDto {
  @IsJWT({ message: 'Token is not correct' })
  token: string;
}

export default JwtTokenDto;
