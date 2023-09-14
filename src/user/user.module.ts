import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [MailModule, TokenModule, WebhookModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
