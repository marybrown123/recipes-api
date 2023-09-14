import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './DTOs/create-user.DTO';
import { Role } from '@prisma/client';
import { UserResponse } from './responses/user.response';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { WebhookService } from '../webhook/webhook.service';
import { WebhookName } from '../webhook/enums/webhookName.enum';

@Injectable()
export class UserService {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private mailService: MailService,
    private webhookService: WebhookService,
  ) {}

  async createUser(user: CreateUserDTO): Promise<UserResponse> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (userFromDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.hashPassword(user.password);

    const userForDb = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        roles: [Role.USER],
      },
    });

    const verificationToken = await this.tokenService.generateVerificationToken(
      userForDb,
    );

    if (userForDb) {
      await this.mailService.sendMail(
        userForDb.email,
        'Recipe App',
        'Verify your account',
        `Hello ${userForDb.name}, click the following link to verify your account: http://testLink/${verificationToken.verificationToken}`,
      );
    }

    return new UserResponse(userForDb);
  }

  async findOne(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async generateAccount(
    email: string,
    name: string,
    password: string,
    role: Role,
  ): Promise<User> {
    const userFromDb = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userFromDb) {
      return userFromDb;
    }

    const hashedUserPassword = await this.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedUserPassword,
        roles: [role],
      },
    });
  }

  async updateVerificationStatus(userId: number): Promise<UserResponse> {
    const verifiedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });

    const userToReturn = new UserResponse(verifiedUser);

    await this.webhookService.sendWebhook(
      userToReturn,
      WebhookName.UserVerifiedWebhook,
    );

    return userToReturn;
  }
}
