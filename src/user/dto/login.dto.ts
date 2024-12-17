import { EntityResponseDTO } from '../../dto/response.dto';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto extends EntityResponseDTO {
  token: string;
  expirationTime: string;
}
