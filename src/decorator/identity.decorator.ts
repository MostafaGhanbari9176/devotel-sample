import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IdentityDto } from "../dto/identity.dto";

export const Identity = createParamDecorator((field:any, ctx:ExecutionContext):IdentityDto => {

  const request = ctx.switchToHttp().getRequest();

  return {
    userRole:request.identity.userRole,
    username:request.identity.username,
    token:request.identity.token,
  }
})


