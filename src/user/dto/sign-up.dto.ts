import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  firstname: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
  })
  @ApiProperty({ required: true, type: String })
  password: string;
}
