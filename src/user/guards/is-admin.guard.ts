import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class IsAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user.roles.includes(Role.ADMIN)) {
      throw new HttpException('User is not admin', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
