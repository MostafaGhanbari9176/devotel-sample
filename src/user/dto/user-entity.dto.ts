import { UserRole } from '../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';
import { EntityResponseDTO, ListResponseDTO } from '../../dto/response.dto';
import { ApiResponseProperty } from "@nestjs/swagger";

export class UserDetailDto {
  @ApiResponseProperty({ type: String })
  username: string;
  @ApiResponseProperty({ type: String })
  email: string;
  @ApiResponseProperty({ enum: UserRole })
  role: UserRole;
  @ApiResponseProperty({ type: String })
  firstname: string;
  @ApiResponseProperty({ type: String })
  lastname: string;
}

export class UserDTO extends PickType(UserDetailDto, [
  'username',
  'email',
  'role',
] as const) {}

export class UserDetailResponseDTO extends EntityResponseDTO {
  @ApiResponseProperty({type:UserDetailDto})
  user: UserDetailDto;
}

export class UserListResponseDTO extends ListResponseDTO {
  @ApiResponseProperty({type:[UserDTO]})
  users: UserDTO[];
}
