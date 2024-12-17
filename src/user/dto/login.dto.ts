import { EntityResponseDTO } from "../../dto/response.dto";

export class LoginDto {
  email: string;
  password: string;
}

export class LoginResponseDto extends EntityResponseDTO {
  token: string;
  expirationTime:string
}
