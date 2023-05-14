import { PrismaService } from '../../../prisma/prisma.service';
import { RecipeService } from '../../recipe.service';
import { Test, TestingModule } from '@nestjs/testing';

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
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, PrismaService],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    prismaService = module.get<PrismaService>(PrismaService);
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

    const prismaCreate = jest
      .spyOn(prismaService.recipe, 'create')
      .mockResolvedValue(mockResult);

    const result = await recipeService.createRecipe(recipe, 1);

    expect(prismaCreate).toBeCalledTimes(1);

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
    const mockPrismaUpdateResult = {
      id: 1,
      authorId: 1,
      name: 'Pasta',
      description: 'Easy pasta recipe',
      imageURL: 'imageURL',
      preparing: [{ id: 1, step: 'add flour', order: 1 }],
      ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
    } as any;

    const mockPrismaFindUniqueResult = {
      id: 1,
      authorId: 1,
      name: 'Dumplings',
      description: 'Easy dumplings recipe',
      imageURL: 'imageURL',
      preparing: [{ id: 1, step: 'add flour', order: 1 }],
      ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
    } as any;

    const prismaFindUnique = jest
      .spyOn(prismaService.recipe, 'findUnique')
      .mockResolvedValue(mockPrismaFindUniqueResult);

    const prismaUpdate = jest
      .spyOn(prismaService.recipe, 'update')
      .mockResolvedValue(mockPrismaUpdateResult);

    const result = await recipeService.updateRecipe(1, newRecipe);

    expect(prismaUpdate).toBeCalledTimes(1);
    expect(prismaFindUnique).toBeCalledTimes(1);
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

    const prismaFindUnique = jest
      .spyOn(prismaService.recipe, 'findUnique')
      .mockResolvedValue(mockResult);

    const result = await recipeService.findRecipeById(1);

    expect(prismaFindUnique).toBeCalledTimes(1);
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
        name: 'Pasta',
        description: 'Easy pasta recipe',
        imageURL: 'imageURL',
        preparing: [{ id: 1, step: 'add flour', order: 1 }],
        ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
      } as any,
    ];

    const prismaFindMany = jest
      .spyOn(prismaService.recipe, 'findMany')
      .mockResolvedValue(mockResult);

    const result = await recipeService.findAllRecipes(5, 1);

    expect(prismaFindMany).toBeCalledTimes(1);
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
    expect(result[1].name).toBe('Pasta');
    expect(result[1].description).toBe('Easy pasta recipe');
    expect(result[1].imageURL).toBe('imageURL');
    expect(result[1].preparing[0].step).toBe('add flour');
    expect(result[1].preparing[0].order).toBe(1);
    expect(result[1].ingredients[0].name).toBe('flour');
    expect(result[1].ingredients[0].amount).toBe('spoon');
    expect(result[1].authorId).toBe(1);
  });

  it('should find one recipe by name', async () => {
    const mockResult = [
      {
        id: 1,
        authorId: 1,
        name: 'Dumplings',
        description: 'Easy dumplings recipe',
        imageURL: 'imageURL',
        preparing: [{ id: 1, step: 'add flour', order: 1 }],
        ingredients: [{ id: 1, name: 'flour', amount: 'spoon' }],
      },
    ] as any;

    const prismaFindMany = jest
      .spyOn(prismaService.recipe, 'findMany')
      .mockResolvedValue(mockResult);

    const result = await recipeService.findRecipeByName('pas');

    expect(prismaFindMany).toBeCalledTimes(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('Dumplings');
    expect(result[0].description).toBe('Easy dumplings recipe');
    expect(result[0].imageURL).toBe('imageURL');
    expect(result[0].preparing[0].step).toBe('add flour');
    expect(result[0].preparing[0].order).toBe(1);
    expect(result[0].ingredients[0].name).toBe('flour');
    expect(result[0].ingredients[0].amount).toBe('spoon');
    expect(result[0].authorId).toBe(1);
  });
});
