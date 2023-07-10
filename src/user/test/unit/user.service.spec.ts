import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../user.service';

const user = {
  name: 'mary',
  password: 'abcdefgh',
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const mockCreateResult = {
      id: 1,
      name: 'mary',
      password: 'afuakuasbukaUAASGSA',
      roles: [Role.USER],
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

    const result = await userService.createUser(user);

    expect(prismaCreate).toBeCalledTimes(1);
    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(hashedPassword).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('mary');
  });

  it('should find one user by id', async () => {
    const mockFindUniqueResult = {
      id: 1,
      name: 'mary',
      password: 'afuakuasbukaUAASGSA',
      roles: [Role.USER],
    };

    const prismaFindUnique = jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(mockFindUniqueResult);

    const result = await userService.findOne('mary');

    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('mary');
    expect(result.password).toBe('afuakuasbukaUAASGSA');
    expect(result.roles[0]).toBe(Role.USER);
  });

  it('should generate admin account', async () => {
    const mockPrismaCreateResult = {
      id: 2,
      name: 'admin123',
      password: 'admin456',
      roles: [Role.USER, Role.ADMIN],
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
      'admin123',
      'admin456',
      Role.ADMIN,
    );

    expect(prismaFindUnique).toBeCalledTimes(1);
    expect(prismaCreate).toBeCalledTimes(1);
    expect(hashPassword).toBeCalledTimes(1);
    expect(result.id).toBe(2);
    expect(result.name).toBe('admin123');
  });
});
