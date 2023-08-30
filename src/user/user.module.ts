import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [UserService, PrismaService, MailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
