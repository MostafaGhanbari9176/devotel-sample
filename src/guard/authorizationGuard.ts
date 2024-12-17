import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/entities/user.entity';
import { CHECK_ROLE_KEY } from '../decorator/role.decorator';

export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(CHECK_ROLE_KEY, [
      context.getHandler(),
      context.getClass,
    ]);

    if (!roles || roles.length == 0) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.identifier.userRole;

    if(!userRole)
      return true

    const have = roles.find((r) => r == userRole);

    return have != undefined;
  }
}
