import { EntityResponseDTO } from '../../dto/response.dto';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  password: string;
}

export class LoginResponseDto extends EntityResponseDTO {
  @ApiResponseProperty({type:String})
  token: string;
  @ApiResponseProperty({type:String})
  expirationTime: string;
}
