import { RecipeService } from '../../recipe.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

const recipe = {
  name: 'Dumplings',
  description: 'Easy dumplings recipe',
  imageURL: 'imageURL',
  preparing: [{ id: 1, step: 'add flour', order: 1 }],
  ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
};

const newRecipe = {
  name: 'Pasta',
  description: 'Easy pasta recipe',
};

describe('Recipe Service', () => {
  let recipeService: RecipeService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a recipe', async () => {
    const mockResult = {
      id: 1,
      authorId: 1,
      name: 'Dumplings',
      description: 'Easy dumplings recipe',
      imageURL: 'imageURL',
      preparing: [{ id: 1, step: 'add flour', order: 1 }],
      ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
    } as any;

    const commandBusExecuteCreate = jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue(mockResult);

    const result = await recipeService.createRecipe(recipe, 1);

    expect(commandBusExecuteCreate).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(result.authorId).toBe(1);
  });

  it('should update a recipe', async () => {
    const mockResult = {
      id: 1,
      authorId: 1,
      name: 'Pasta',
      description: 'Easy pasta recipe',
      imageURL: 'imageURL',
      preparing: [{ id: 1, step: 'add flour', order: 1 }],
      ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
    } as any;

    const commandBusExecuteUpdate = jest
      .spyOn(commandBus, 'execute')
      .mockResolvedValue(mockResult);

    const result = await recipeService.updateRecipe(1, newRecipe);

    expect(commandBusExecuteUpdate).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Pasta');
    expect(result.description).toBe('Easy pasta recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(result.authorId).toBe(1);
  });

  it('should find one recipe by id', async () => {
    const mockResult = {
      id: 1,
      authorId: 1,
      name: 'Dumplings',
      description: 'Easy dumplings recipe',
      imageURL: 'imageURL',
      preparing: [{ id: 1, step: 'add flour', order: 1 }],
      ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
    } as any;

    const queryBusExecuteFindOne = jest
      .spyOn(queryBus, 'execute')
      .mockResolvedValue(mockResult);

    const result = await recipeService.findRecipeById(1);

    expect(queryBusExecuteFindOne).toBeCalledTimes(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe('Dumplings');
    expect(result.description).toBe('Easy dumplings recipe');
    expect(result.imageURL).toBe('imageURL');
    expect(result.preparing[0].step).toBe('add flour');
    expect(result.preparing[0].order).toBe(1);
    expect(result.ingredients[0].name).toBe('flour');
    expect(result.ingredients[0].amount).toBe('spoon');
    expect(result.authorId).toBe(1);
  });

  it('should list all recipes', async () => {
    const mockResult = [
      {
        id: 1,
        authorId: 1,
        name: 'Dumplings',
        description: 'Easy dumplings recipe',
        imageURL: 'imageURL',
        preparing: [{ id: 1, step: 'add flour', order: 1 }],
        ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
      } as any,
      {
        id: 2,
        authorId: 1,
        name: 'Dumplings',
        description: 'Easy dumplings recipe',
        imageURL: 'imageURL',
        preparing: [{ id: 1, step: 'add flour', order: 1 }],
        ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
      } as any,
    ];

    const queryBusExecuteFindMany = jest
      .spyOn(queryBus, 'execute')
      .mockResolvedValue(mockResult);

    const result = await recipeService.findAllRecipes({
      name: 'Dump',
      page: 1,
      limit: 2,
    });

    expect(queryBusExecuteFindMany).toBeCalledTimes(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('Dumplings');
    expect(result[0].description).toBe('Easy dumplings recipe');
    expect(result[0].imageURL).toBe('imageURL');
    expect(result[0].preparing[0].step).toBe('add flour');
    expect(result[0].preparing[0].order).toBe(1);
    expect(result[0].ingredients[0].name).toBe('flour');
    expect(result[0].ingredients[0].amount).toBe('spoon');
    expect(result[0].authorId).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[1].name).toBe('Dumplings');
    expect(result[1].description).toBe('Easy dumplings recipe');
    expect(result[1].imageURL).toBe('imageURL');
    expect(result[1].preparing[0].step).toBe('add flour');
    expect(result[1].preparing[0].order).toBe(1);
    expect(result[1].ingredients[0].name).toBe('flour');
    expect(result[1].ingredients[0].amount).toBe('spoon');
    expect(result[1].authorId).toBe(1);
  });
});
