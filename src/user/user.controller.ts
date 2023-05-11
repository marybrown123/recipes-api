import { Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signup')
  async createUser(@Body() user: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userForDb = {
      name: user.name,
      password: hashedPassword,
    };
    const createdUser = await this.usersService.createUser(userForDb);
    return createdUser;
  }
}
