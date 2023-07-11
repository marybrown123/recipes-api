import { RecipeService } from '../../recipe.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CqrsModule],
    }).compile();

    await module.createNestApplication().init();
    recipeService = module.get<RecipeService>(RecipeService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

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

  it('should find one recipe by id', async () => {
    const queryBusExecuteFindOne = jest.spyOn(queryBus, 'execute');

    const recipeFromDb = await recipeService.createRecipe(recipe, testUser.id);
    const result = await recipeService.findRecipeById(recipeFromDb.id);

    expect(queryBusExecuteFindOne).toBeCalledTimes(1);
    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
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
