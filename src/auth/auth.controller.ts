import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessToken } from '../common/interfaces/access-token.interface';
import { User } from '@prisma/client';
import { IsUserVerifiedGuard } from '../user/guards/is-user-verified.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'), IsUserVerifiedGuard)
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'Token' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @Post('/login')
  async login(@CurrentUser() user: User): Promise<AccessToken> {
    return this.authService.login(user);
  }
}
