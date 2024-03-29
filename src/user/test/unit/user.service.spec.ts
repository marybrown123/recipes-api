import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../user.service';
import { MailService } from '../../../mail/mail.service';
import { MailServiceMock } from '../mocks/mail.service.mock';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../../token/token.service';

const user = {
  email: 'testEmail',
  name: 'testName',
  password: 'testPassword',
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let mailService: MailService;
  let tokenService: TokenService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        UserService,
        MailService,
        TokenService,
        JwtService,
      ],
    })
      .overrideProvider(MailService)
      .useClass(MailServiceMock)
      .compile();

    await module.createNestApplication().init();
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create a user', async () => {
    const mockCreateResult = {
      id: 1,
      email: 'testEmail',
      name: 'mary',
      password: 'afuakuasbukaUAASGSA',
      roles: [Role.USER],
      isVerified: false,
    };

    const mockToken = {
      verificationToken: 'testToken',
    };

    const mockFindUniqueResult = null;

    const prismaCreate = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValue(mockCreateResult);

    const prismaFindUnique = jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockFindUniqueResult);

    const hashedPassword = jest
      .spyOn(userService, 'hashPassword')
      .mockResolvedValue('afuakuasbukaUAASGSA');

    jest
      .spyOn(tokenService, 'generateVerificationToken')
      .mockResolvedValue(mockToken);
    const mailSend = jest.spyOn(mailService, 'sendMail');

    const result = await userService.createUser(user);

    expect(prismaCreate).toBeCalledTimes(1);
    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(hashedPassword).toBeCalledTimes(1);
    expect(mailSend).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.email).toBe('testEmail');
    expect(result.name).toBe('mary');
  });

  it('should find one user by id', async () => {
    const mockFindUniqueResult = {
      id: 1,
      email: 'testEmail',
      name: 'mary',
      password: 'afuakuasbukaUAASGSA',
      roles: [Role.USER],
      isVerified: false,
    };

    const prismaFindUnique = jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockFindUniqueResult);

    const result = await userService.findOne('testEmail');

    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.email).toBe('testEmail');
    expect(result.name).toBe('mary');
    expect(result.password).toBe('afuakuasbukaUAASGSA');
    expect(result.roles[0]).toBe(Role.USER);
  });

  it('should generate admin account', async () => {
    const mockPrismaCreateResult = {
      id: 2,
      email: 'adminEmail',
      name: 'admin123',
      password: 'admin456',
      roles: [Role.USER, Role.ADMIN],
      isVerified: false,
    };

    const prismaFindUnique = jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(null);

    const hashPassword = jest
      .spyOn(userService, 'hashPassword')
      .mockResolvedValue('gdvuvdufwvafvfevu');

    const prismaCreate = jest
      .spyOn(prismaService.user, 'create')
      .mockResolvedValue(mockPrismaCreateResult);

    const result = await userService.generateAccount(
      'adminEmail',
      'admin123',
      'admin456',
      Role.ADMIN,
    );

    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(prismaCreate).toBeCalledTimes(1);
    expect(hashPassword).toBeCalledTimes(1);
    expect(result.email).toBe('adminEmail');
    expect(result.id).toBe(2);
    expect(result.name).toBe('admin123');
  });
});
