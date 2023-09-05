import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthenticationToken } from '../common/interfaces/authentication-token.interface';
import { TokenService } from '../token/token.service';

@Controller('/auth')
export class AuthController {
  constructor(private tokenService: TokenService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'Token' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @Post('/login')
  async login(@CurrentUser() user: User): Promise<AuthenticationToken> {
    return this.tokenService.generateAuthenticationToken(user);
  }
}
