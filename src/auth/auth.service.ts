import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { AccessToken } from 'src/common/interfaces/access-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(name: string, password: string): Promise<User> {
    const user = await this.userService.findOne(name);

    if (!user) {
      throw new HttpException(
        'There is no user with such a name',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new HttpException('Wrong password', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { name: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
