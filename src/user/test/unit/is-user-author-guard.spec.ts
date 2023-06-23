import { Role } from '@prisma/client';
import { IsUserAuthorGuard } from '../../../user/guards/is-user-author.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { RecipeService } from '../../../recipe/recipe.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';

describe('IsUserAuthorGuard', () => {
  let isUserAuthorGuard: IsUserAuthorGuard;
  const mockRequest = {
    params: {
      id: 1,
    },
    user: {
      id: 1,
      name: 'testName',
      password: 'testPassword',
      roles: [Role.USER],
    },
  };
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    }),
  } as ExecutionContext;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, PrismaService, IsUserAuthorGuard],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .compile();
    isUserAuthorGuard = module.get<IsUserAuthorGuard>(IsUserAuthorGuard);
  });

  it('should allow acces when user is an author', async () => {
    const result = await isUserAuthorGuard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should deny access when user is not an author', async () => {
    mockRequest.user.id = 2;

    const result = await isUserAuthorGuard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
  });
});
