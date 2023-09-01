import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { VerificationToken } from '../common/interfaces/verification-token.interface';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';

@Injectable()
export class VerificationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async generateVerificationToken(user: User): Promise<VerificationToken> {
    const payload = { email: user.email, sub: user.id };
    return {
      verificationToken: this.jwtService.sign(payload),
    };
  }

  async verifyAccount(verificationToken: string): Promise<void> {
    try {
      await this.jwtService.verify(verificationToken);
      const userToBeVerified =
        await this.userService.finsOneByVerificationToken(verificationToken);
      await this.userService.updateUserVerification(userToBeVerified.id);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
