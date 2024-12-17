import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator/auth.decorator";
import { Request } from "express";
import { FirebaseService } from "../firebase/firebase.service";

export class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly fireBaseService: FirebaseService,
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{

    const unAuthRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if(unAuthRoute)
      return true

    const reqoest = context.switchToHttp().getRequest();
    const token = this.fetchToken(reqoest);

    if(!token)
      throw new UnauthorizedException("token is not valid")

    try {
      const identity = await this.fireBaseService.validateToken(token)
      reqoest.identity = identity
    }catch(error){
      if (error.code === "auth/id-token-expired") {
        throw new UnauthorizedException("Token expired.");
      }
      throw new UnauthorizedException("Invalid token");
    }

    return true
  }

  fetchToken(req: Request): string | null {
    const [type, token] = req.headers.authorization?.split(" ") ?? []
    return type == "Bearer" ? token : null
  }

}

