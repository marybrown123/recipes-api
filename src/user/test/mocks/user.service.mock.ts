/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateUserDTO } from 'src/user/DTOs/create-user.DTO';
import { UserResponse } from '../../../user/responses/user.response';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';

export class UserServiceMock implements Required<UserService> {
  private generateUser(): User {
    return {
      id: 1,
      name: 'testName',
      password: 'testPassword',
      roles: [Role.USER],
    };
  }

  private generateUserResponse(): UserResponse {
    return new UserResponse(this.generateUser());
  }

  async createUser(_user: CreateUserDTO): Promise<UserResponse> {
    return this.generateUserResponse();
  }

  async findOne(_name: string): Promise<User> {
    return this.generateUser();
  }

  async hashPassword(_password: string): Promise<string> {
    return 'abcdefg';
  }

  async generateAccount(
    _name: string,
    _password: string,
    _role: Role,
  ): Promise<User> {
    return {
      id: 1,
      name: 'testName',
      password: 'testPassword',
      roles: [Role.USER],
    };
  }
}
