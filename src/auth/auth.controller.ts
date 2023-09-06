import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { TokenService } from '../token/token.service';
import { AuthenticationTokenDTO } from '../token/DTOs/authentication-token.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private tokenService: TokenService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ type: AuthenticationTokenDTO })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @Post('/login')
  async login(@CurrentUser() user: User): Promise<AuthenticationTokenDTO> {
    return this.tokenService.generateAuthenticationToken(user);
  }
}
