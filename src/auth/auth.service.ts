import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserPayload } from '../common/interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
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

  async generateToken(user: User): Promise<string> {
    const payload: UserPayload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<UserPayload> {
    return this.jwtService.verify(token) as UserPayload;
  }
}
