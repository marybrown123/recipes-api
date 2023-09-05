import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
