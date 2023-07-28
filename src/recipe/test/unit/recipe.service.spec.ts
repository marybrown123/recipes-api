import { RecipeService } from '../../recipe.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const recipe = {
  name: 'Dumplings',
  description: 'Easy dumplings recipe',
  imageURL: 'imageURL',
  preparing: [{ step: 'add flour', order: 1 }],
  ingredients: [{ name: 'flour', amount: 'spoon' }],
};

const newRecipe = {
  name: 'Pasta',
  description: 'Easy pasta recipe',
};

describe('Recipe Service', () => {
  let recipeService: RecipeService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let userService: UserService;
  let testUser: User;
  let prismaService: PrismaService;
  let cacheService: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CqrsModule],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    await module.createNestApplication().init();
    recipeService = module.get<RecipeService>(RecipeService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get(CACHE_MANAGER);

    testUser = await userService.generateAccount(
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await prismaService.recipe.deleteMany();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
  });

  it('should create a recipe', async () => {
    const commandBusExecuteCreate = jest.spyOn(commandBus, 'execute');

    const result = await recipeService.createRecipe(recipe, testUser.id);

    expect(commandBusExecuteCreate).toBeCalledTimes(1);
    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
  });

  it('should update a recipe', async () => {
    const commandBusExecuteUpdate = jest.spyOn(commandBus, 'execute');

    const recipeFromDb = await recipeService.createRecipe(recipe, testUser.id);
    const result = await recipeService.updateRecipe(recipeFromDb.id, newRecipe);

    expect(commandBusExecuteUpdate).toBeCalledTimes(2);
    expect(result.name).toBe('Pasta');
    expect(result.description).toBe('Easy pasta recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
  });

  it('should return cached data if available', async () => {
    const queryBusExecuteFindOne = jest.spyOn(queryBus, 'execute');
    const cacheServiceGet = jest
      .spyOn(cacheService, 'get')
      .mockResolvedValue(recipe);

    const recipeFromDb = await recipeService.createRecipe(recipe, testUser.id);
    const result = await recipeService.findRecipeById(recipeFromDb.id);

    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(cacheServiceGet).toBeCalledWith(`/recipe/${recipeFromDb.id}`);
    expect(queryBusExecuteFindOne).toBeCalledTimes(0);
    expect(cacheServiceGet).toBeCalledTimes(1);
  });

  it('should call database and save new cache', async () => {
    const queryBusExecuteFindOne = jest.spyOn(queryBus, 'execute');
    const cacheServiceSet = jest.spyOn(cacheService, 'set');
    const cacheServiceGet = jest
      .spyOn(cacheService, 'get')
      .mockResolvedValue(null);

    const recipeFromDb = await recipeService.createRecipe(recipe, testUser.id);
    const result = await recipeService.findRecipeById(recipeFromDb.id);

    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(cacheServiceGet).toBeCalledTimes(1);
    expect(queryBusExecuteFindOne).toBeCalledTimes(1);
    expect(cacheServiceSet).toBeCalledTimes(1);
  });

  it('should list all recipes', async () => {
    const queryBusExecuteFindMany = jest.spyOn(queryBus, 'execute');

    await recipeService.createRecipe(recipe, testUser.id);
    const result = await recipeService.findAllRecipes({
      name: 'Dum',
      page: 1,
      limit: 2,
    });

    expect(queryBusExecuteFindMany).toBeCalledTimes(1);
    expect(result[0].name).toBe('Dumplings');
    expect(result[0].description).toBe('Easy dumplings recipe');
    expect(result[0].imageURL).toBe('imageURL');
    expect(result[0].preparing[0].step).toBe('add flour');
    expect(result[0].preparing[0].order).toBe(1);
    expect(result[0].ingredients[0].name).toBe('flour');
    expect(result[0].ingredients[0].amount).toBe('spoon');
  });
});
