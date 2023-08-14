import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeResponse } from './responses/recipe.response';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';
import { FindAllRecipesDTO } from './DTOs/find-all-recipes-query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from './queries/impl/findRecipeById.query';
import { CreateRecipeCommand } from '../recipe/commands/impl/createRecipe.command';
import { UpdateRecipeCommand } from '../recipe/commands/impl/updateRecipe.command';
import { FindAllRecipesQuery } from '../recipe/queries/impl/findAllRecipes.query';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RecipeService {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async createRecipe(
    recipe: CreateRecipeDTO,
    authorId: number,
  ): Promise<RecipeResponse> {
    return this.commandBus.execute(new CreateRecipeCommand(recipe, authorId));
  }

  async updateRecipe(
    recipeId: number,
    newRecipe: UpdateRecipeDTO,
  ): Promise<RecipeResponse> {
    return this.commandBus.execute(
      new UpdateRecipeCommand(recipeId, newRecipe),
    );
  }

  async findRecipeById(recipeId: number): Promise<RecipeResponse> {
    const cachedData = await this.cacheService.get<RecipeResponse>(
      `/recipe/${recipeId}`,
    );
    if (cachedData) {
      return cachedData;
    } else {
      const recipeFromDb = await this.queryBus.execute(
        new FindRecipeByIdQuery(recipeId),
      );
      await this.cacheService.set(`/recipe/${recipeId}`, recipeFromDb);
      return recipeFromDb;
    }
  }

  async findAllRecipes(query: FindAllRecipesDTO): Promise<RecipeResponse[]> {
    return this.queryBus.execute(new FindAllRecipesQuery(query));
  }
}
