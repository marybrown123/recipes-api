import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signup')
  async createUser(@Body() user: CreateUserDTO) {
    return await this.usersService.createUser(user);
  }
}
