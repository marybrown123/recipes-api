import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { VerifiedUserPayload } from '../common/interfaces/verified-user-payload.interface';
import { VerificationToken } from '../common/interfaces/verification-token.interface';
import { AuthenticationToken } from '../common/interfaces/authentication-token.interface';
import { AuthenticatedUserPayload } from '../common/interfaces/authenticated-user-payload.interface';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateVerificationToken(user: User): Promise<VerificationToken> {
    const payload: VerifiedUserPayload = {
      email: user.email,
      name: user.name,
      sub: user.id,
    };

    const verificationToken = await this.jwtService.sign(payload);
    return { verificationToken };
  }

  async generateAuthenticationToken(user: User): Promise<AuthenticationToken> {
    const payload: AuthenticatedUserPayload = {
      email: user.email,
      sub: user.id,
    };

    const authenticationToken = await this.jwtService.sign(payload);
    return { authenticationToken };
  }

  async verifyVerificationToken(
    verificationToken: VerificationToken,
  ): Promise<VerifiedUserPayload> {
    try {
      return this.jwtService.verify(verificationToken.verificationToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async verifyAuthenticationToken(
    authenticationToken: AuthenticationToken,
  ): Promise<AuthenticatedUserPayload> {
    try {
      return this.jwtService.verify(authenticationToken.authenticationToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
