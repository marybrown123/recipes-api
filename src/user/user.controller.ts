import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Put,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { AuthService } from '../auth/auth.service';
@Controller('/user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    @Param() verificationToken: string,
  ): Promise<UserResponse> {
    const userPayload = await this.authService.verifyToken(verificationToken);
    return this.usersService.updateVerificationStatus(userPayload.sub);
  }
}
