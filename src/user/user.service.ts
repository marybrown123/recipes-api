import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { Role } from '@prisma/client';
import { UserResponse } from './responses/user.response';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: CreateUserDTO): Promise<UserResponse> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { name: user.name },
    });

    if (userFromDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.hashPassword(user.password);

    const userForDb = await this.prisma.user.create({
      data: {
        name: user.name,
        password: hashedPassword,
        roles: [Role.USER],
      },
    });

    return new UserResponse(userForDb);
  }

  async findOne(name: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async generateAccount(
    name: string,
    password: string,
    role: Role,
  ): Promise<User> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { name },
    });

    if (userFromDb) {
      return userFromDb;
    }

    const hashedUserPassword = await this.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        name,
        password: hashedUserPassword,
        roles: [role],
      },
    });
  }
}
