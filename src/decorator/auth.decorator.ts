import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = Symbol.for("IS_PUBLIC_KEY");
export const UnAuthorizedRoute = () => SetMetadata(IS_PUBLIC_KEY, true);

