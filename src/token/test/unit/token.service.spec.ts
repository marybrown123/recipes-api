import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { TokenService } from '../../token.service';
import { Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { VerificationToken } from '../../../common/interfaces/verification-token.interface';
import { VerifiedUserPayload } from 'src/common/interfaces/verified-user-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUserPayload } from 'src/common/interfaces/authenticated-user-payload.interface';
import { AuthenticationToken } from 'src/common/interfaces/authentication-token.interface';

const testUser: User = {
  email: 'testEmail',
  name: 'testName',
  password: 'testPassword',
  id: 1,
  isVerified: false,
  roles: [Role.USER],
};

const verifiedTestUserPayload: VerifiedUserPayload = {
  name: testUser.name,
  email: testUser.email,
  sub: testUser.id,
};

const invalidVerificationToken: VerificationToken = {
  verificationToken: 'invalidVerificationToken',
};

const authenticatedTestUserPayload: AuthenticatedUserPayload = {
  email: testUser.email,
  sub: testUser.id,
};

const invalidAuthenticationToken: AuthenticationToken = {
  authenticationToken: 'invalidAuthenticationToken',
};

describe('Token Service', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let validVerificationToken: VerificationToken;
  let validAuthenticationToken: AuthenticationToken;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await module.createNestApplication().init();
    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);

    validVerificationToken = {
      verificationToken: jwtService.sign(verifiedTestUserPayload),
    };

    validAuthenticationToken = {
      authenticationToken: jwtService.sign(authenticatedTestUserPayload),
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should generate verification token', async () => {
    const jwtServiceSign = jest.spyOn(jwtService, 'sign');

    const result = await tokenService.generateVerificationToken(testUser);

    expect(jwtServiceSign).toBeCalledTimes(1);
    expect(typeof result.verificationToken).toBe('string');
  });

  it('should generate authentication token', async () => {
    const jwtServiceSign = jest.spyOn(jwtService, 'sign');

    const result = await tokenService.generateAuthenticationToken(testUser);

    expect(jwtServiceSign).toBeCalledTimes(1);
    expect(typeof result.authenticationToken).toBe('string');
  });

  it('should verify verification token and return verified user payload', async () => {
    const jwtServiceVerify = jest.spyOn(jwtService, 'verify');

    const result = await tokenService.verifyVerificationToken(
      validVerificationToken,
    );

    expect(jwtServiceVerify).toBeCalledTimes(1);
    expect(result.email).toBe(testUser.email);
    expect(result.name).toBe(testUser.name);
    expect(result.sub).toBe(testUser.id);
  });

  it('should throw error when provided verification token is invalid', async () => {
    const jwtServiceVerify = jest.spyOn(jwtService, 'verify');
    try {
      await tokenService.verifyVerificationToken(invalidVerificationToken);
    } catch (error) {
      expect(error instanceof UnauthorizedException).toBe(true);
    }
    expect(jwtServiceVerify).toBeCalledTimes(1);
  });

  it('should verify authentication token and return authenticated user payload', async () => {
    const jwtServiceVerify = jest.spyOn(jwtService, 'verify');

    const result = await tokenService.verifyAuthenticationToken(
      validAuthenticationToken,
    );

    expect(jwtServiceVerify).toBeCalledTimes(1);
    expect(result.email).toBe(testUser.email);
    expect(result.sub).toBe(testUser.id);
  });

  it('should throw error when provided authentication token is invalid', async () => {
    const jwtServiceVerify = jest.spyOn(jwtService, 'verify');
    try {
      await tokenService.verifyAuthenticationToken(invalidAuthenticationToken);
    } catch (error) {
      expect(error instanceof UnauthorizedException).toBe(true);
    }
    expect(jwtServiceVerify).toBeCalledTimes(1);
  });
});
