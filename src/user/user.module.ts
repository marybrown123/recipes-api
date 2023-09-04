import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
