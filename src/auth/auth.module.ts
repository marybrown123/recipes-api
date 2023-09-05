import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [UserModule, PassportModule, MailModule, TokenModule],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    PrismaService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
