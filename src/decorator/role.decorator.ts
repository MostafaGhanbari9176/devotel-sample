import { UserRole } from "../user/entities/user.entity";
import { SetMetadata } from "@nestjs/common";

export const CHECK_ROLE_KEY = "CHECK_ROLE_KEY"
export const CheckRole = (roles:UserRole[]) => SetMetadata(CHECK_ROLE_KEY, roles)

