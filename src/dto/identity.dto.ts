import { UserRole } from "../user/entities/user.entity";

export class IdentityDto {
  username: string
  token: string
  userRole:UserRole
}

