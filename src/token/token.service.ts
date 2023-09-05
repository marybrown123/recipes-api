import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { VerifiedUserPayload } from '../common/interfaces/verified-user-payload.interface';
import { AuthenticatedUserPayload } from '../common/interfaces/authenticated-user-payload.interface';
import { VerificationTokenDTO } from './DTOs/verification-token.dto';
import { AuthenticationTokenDTO } from './DTOs/authentication-token.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateVerificationToken(user: User): Promise<VerificationTokenDTO> {
    const payload: VerifiedUserPayload = {
      email: user.email,
      name: user.name,
      sub: user.id,
    };

    const verificationToken = await this.jwtService.sign(payload);
    return { verificationToken };
  }

  async generateAuthenticationToken(
    user: User,
  ): Promise<AuthenticationTokenDTO> {
    const payload: AuthenticatedUserPayload = {
      email: user.email,
      sub: user.id,
    };

    const authenticationToken = await this.jwtService.sign(payload);
    return { authenticationToken };
  }

  async verifyVerificationToken(
    verificationToken: VerificationTokenDTO,
  ): Promise<VerifiedUserPayload> {
    try {
      return this.jwtService.verify(verificationToken.verificationToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async verifyAuthenticationToken(
    authenticationToken: AuthenticationTokenDTO,
  ): Promise<AuthenticatedUserPayload> {
    try {
      return this.jwtService.verify(authenticationToken.authenticationToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
