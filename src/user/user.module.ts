import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [UserService, PrismaService, MailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
