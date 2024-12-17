import { UserRole } from '../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';
import { EntityResponseDTO, ListResponseDTO } from '../../dto/response.dto';

export class UserDetailDto {
  username: string;
  email: string;
  role: UserRole;
  firstname: string;
  lastname: string;
}

export class UserDTO extends PickType(UserDetailDto, [
  'username',
  'email',
  'role',
] as const) {}

export class UserDetailResponseDTO extends EntityResponseDTO {
  user: UserDetailDto;
}

export class UserListResponseDTO extends ListResponseDTO {
  users: UserDTO[];
}
