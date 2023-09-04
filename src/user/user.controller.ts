import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';

import { VerificationToken } from '../common/interfaces/verification-token.interface';
import { TokenService } from 'src/token/token.service';
@Controller('/user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserResponse })
  async createUser(@Body() user: CreateUserDTO): Promise<UserResponse> {
    return await this.usersService.createUser(user);
  }

  @Put('/verify/:token')
  @ApiOperation({ summary: 'Account verification' })
  @ApiResponse({ type: UserResponse })
  async verifyAccount(
    @Param() verificationToken: VerificationToken,
  ): Promise<UserResponse> {
    const userPayload = await this.tokenService.verifyVerificationToken(
      verificationToken,
    );
    return this.usersService.updateVerificationStatus(userPayload.sub);
  }
}
