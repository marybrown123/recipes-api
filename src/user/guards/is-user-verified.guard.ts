import { CanActivate, ExecutionContext } from '@nestjs/common';

export class IsUserVerifiedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.user.isVerified;
  }
}
