import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { VerificationService } from '../verification/verification.service';
import { VerificationController } from '../verification/verification.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [VerificationService],
  exports: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
