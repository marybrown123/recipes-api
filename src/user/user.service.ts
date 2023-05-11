import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { Role } from '@prisma/client';
import { UserResponse } from './responses/user.response';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: CreateUserDTO) {
    const userFromDb = await this.prisma.user.findUnique({
      where: { name: user.name },
    });

    if (userFromDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const userForDb = await this.prisma.user.create({
      data: {
        name: user.name,
        password: user.password,
        roles: [Role.USER],
      },
    });

    return new UserResponse(userForDb);
  }

  async findOne(name: string) {
    return await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
  }

  async generateAdminAccount() {
    const adminName = process.env.ADMIN_NAME;
    const adminFromDb = await this.prisma.user.findUnique({
      where: { name: adminName },
    });

    if (adminFromDb) {
      return true;
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    return !!(await this.prisma.user.create({
      data: {
        name: adminName,
        password: adminPassword,
        roles: [Role.ADMIN],
      },
    }));
  }
}
