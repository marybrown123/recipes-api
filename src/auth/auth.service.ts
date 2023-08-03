import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AccessToken } from '../common/interfaces/access-token.interface';
import { LoggedUserPayload } from '../common/interfaces/logged-user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(name: string, password: string): Promise<User> {
    const user = await this.userService.findOne(name);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { name: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<LoggedUserPayload> {
    return this.jwtService.verify(token) as LoggedUserPayload;
  }
}
