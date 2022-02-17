import { IsJWT } from 'class-validator';

class JwtTokenDto {
  @IsJWT()
  token: string;
}

export default JwtTokenDto;
