import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserResponse })
  async createUser(@Body() user: CreateUserDTO): Promise<UserResponse> {
    return await this.usersService.createUser(user);
  }
}
