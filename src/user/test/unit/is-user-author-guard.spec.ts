import { Role } from '@prisma/client';
import { IsUserAuthorGuard } from '../../../user/guards/is-user-author.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { RecipeService } from '../../../recipe/recipe.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('IsUserAuthorGuard', () => {
  let isUserAuthorGuard: IsUserAuthorGuard;
  let recipeService: RecipeService;
  const mockFindRecipeByIdResult = {
    id: 1,
    authorId: 1,
    name: 'testName',
    description: 'testDescription',
    imageURL: 'testImageURL',
    preparing: [
      {
        id: 1,
        recipeId: 1,
        step: 'testStep',
        order: 1,
      },
    ],
    ingredients: [
      {
        id: 1,
        recipeId: 1,
        name: 'testName',
        amount: 'testAmount',
      },
    ],
  };
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, PrismaService],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    isUserAuthorGuard = new IsUserAuthorGuard(recipeService);
  });

  it('should allow acces when condition is met', async () => {
    const findRecipeById = jest
      .spyOn(recipeService, 'findRecipeById')
      .mockResolvedValue(mockFindRecipeByIdResult);

    const result = await isUserAuthorGuard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(findRecipeById).toBeCalledTimes(1);
  });

  it('should deny access when condition is not met', async () => {
    const findRecipeById = jest
      .spyOn(recipeService, 'findRecipeById')
      .mockResolvedValue(mockFindRecipeByIdResult);

    mockRequest.user.id = 2;

    const result = await isUserAuthorGuard.canActivate(mockExecutionContext);
    expect(result).toBe(false);
    expect(findRecipeById).toBeCalledTimes(1);
  });
});
