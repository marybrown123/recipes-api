import { Body, Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { TokenService } from '../token/token.service';
import { VerificationTokenDTO } from '../token/DTOs/verification-token.dto';
@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createUser(@Body() user: CreateUserDTO): Promise<UserResponse> {
    return await this.usersService.createUser(user);
  }

  @Put('/verify')
  @ApiOperation({ summary: 'Account verification' })
  @ApiResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async verifyAccount(
    @Body() verificationToken: VerificationTokenDTO,
  ): Promise<UserResponse> {
    const userPayload = await this.tokenService.verifyVerificationToken(
      verificationToken,
    );
    return this.usersService.updateVerificationStatus(userPayload.sub);
  }
}
