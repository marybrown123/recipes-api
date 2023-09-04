import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserPayload } from '../common/interfaces/user-payload.interface';
import { Token } from '../common/interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
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

  async generateToken(user: User): Promise<Token> {
    const payload: UserPayload = { email: user.email, sub: user.id };
    const token = await this.jwtService.sign(payload);
    return { token };
  }

  async verifyToken(token: Token): Promise<UserPayload> {
    try {
      return this.jwtService.verify(token.token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
