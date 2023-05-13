import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'Token' })
  @ApiNotFoundResponse({ description: 'Wrong credentials' })
  @Post('/login')
  async login(@CurrentUser() user) {
    return this.authService.login(user);
  }
}
