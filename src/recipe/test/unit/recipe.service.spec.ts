import { RecipeService } from '../../recipe.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserService } from '../../../user/user.service';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FileService } from '../../../file/file.service';
import { FileResponse } from 'src/file/responses/file.response';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { UserResponse } from 'src/user/responses/user.response';
import { MailService } from '../../../mail/mail.service';
import { MailServiceMock } from '../../../user/test/mocks/mail.service.mock';
import { WebhookEventHandler } from '../../../webhook/webhook-event.handler';
import { WebhookEventHandlerMock } from '../../../webhook/test/mock/webhook-event.handler.mock';

const recipe = {
  name: 'Dumplings',
  description: 'Easy dumplings recipe',
  fileId: 1,
  preparing: [{ step: 'add flour', order: 1 }],
  ingredients: [{ name: 'flour', amount: 'spoon' }],
};

const fileName = 'testName';

const newRecipe = {
  name: 'Pasta',
  description: 'Easy pasta recipe',
};

describe('Recipe Service', () => {
  let recipeService: RecipeService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let userService: UserService;
  let testUser: UserResponse;
  let prismaService: PrismaService;
  let cacheService: Cache;
  let testFile: FileResponse;
  let fileService: FileService;
  let testRecipe: RecipeResponse;
  let webhookEventHandler: WebhookEventHandler;

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
    })
      .overrideProvider(MailService)
      .useClass(MailServiceMock)
      .overrideProvider(WebhookEventHandler)
      .useClass(WebhookEventHandlerMock)
      .compile();

    await module.createNestApplication().init();
    recipeService = module.get<RecipeService>(RecipeService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get(CACHE_MANAGER);
    fileService = module.get<FileService>(FileService);
    webhookEventHandler = module.get<WebhookEventHandler>(WebhookEventHandler);

    testUser = await userService.generateAccount(
      process.env.TEST_EMAIL,
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );

    testFile = await fileService.createFile(fileName);
    recipe.fileId = testFile.id;
  });

  beforeEach(async () => {
    testRecipe = await recipeService.createRecipe(recipe, testUser.id);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prismaService.recipe.deleteMany();
  });

  it('should create a recipe', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    const result = await recipeService.createRecipe(recipe, testUser.id);

    expect(commandBusExecute).toBeCalledTimes(1);
    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.fileId).toBe(testFile.id);
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
  });

  it('should call webhook event handler', async () => {
    const webhookEventHandlerRecipeCreated = jest.spyOn(
      webhookEventHandler,
      'createWebhookEvent',
    );

    await recipeService.createRecipe(recipe, testUser.id);

    expect(webhookEventHandlerRecipeCreated).toBeCalledTimes(1);
  });

  it('should update a recipe', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    const result = await recipeService.updateRecipe(testRecipe.id, newRecipe);

    expect(commandBusExecute).toBeCalledTimes(1);
    expect(result.name).toBe('Pasta');
    expect(result.description).toBe('Easy pasta recipe');
    expect(result.fileId).toBe(testFile.id);
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
  });

  it('should return cached data if available', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');
    const cacheServiceGet = jest
      .spyOn(cacheService, 'get')
      .mockResolvedValue(recipe);

    await recipeService.findRecipeById(testRecipe.id);

    expect(cacheServiceGet).toBeCalledWith(`/recipe/${testRecipe.id}`);
    expect(queryBusExecute).toBeCalledTimes(0);
    expect(cacheServiceGet).toBeCalledTimes(1);
  });

  it('should call database and save new cache', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');
    const cacheServiceSet = jest.spyOn(cacheService, 'set');
    const cacheServiceGet = jest
      .spyOn(cacheService, 'get')
      .mockResolvedValue(null);

    const result = await recipeService.findRecipeById(testRecipe.id);

    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.fileId).toBe(testFile.id);
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(cacheServiceGet).toBeCalledTimes(1);
    expect(queryBusExecute).toBeCalledTimes(2);
    expect(cacheServiceSet).toBeCalledTimes(1);
  });

  it('should list all recipes', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');

    const result = await recipeService.findAllRecipes({
      name: 'Dum',
      page: 1,
      limit: 2,
    });

    expect(queryBusExecute).toBeCalledTimes(2);
    expect(result[0].name).toBe('Dumplings');
    expect(result[0].description).toBe('Easy dumplings recipe');
    expect(result[0].fileId).toBe(testFile.id);
    expect(result[0].preparing[0].step).toBe('add flour');
    expect(result[0].preparing[0].order).toBe(1);
    expect(result[0].ingredients[0].name).toBe('flour');
    expect(result[0].ingredients[0].amount).toBe('spoon');
  });

  it('should delete recipe', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    await recipeService.deleteRecipe(testRecipe.id);

    const deletedRecipe = await prismaService.recipe.findFirst({
      where: { id: testRecipe.id },
    });

    expect(commandBusExecute).toBeCalledTimes(2);
    expect(deletedRecipe).toBe(null);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.file.deleteMany();
  });
});
