import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'Token' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @Post('/login')
  async login(@CurrentUser() user: User): Promise<string> {
    return this.authService.generateToken(user);
  }
}
