import { Injectable } from '@nestjs/common';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeResponse } from './responses/recipe.response';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';
import { FindAllRecipesDTO } from './DTOs/find-all-recipes-query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from './queries/impl/findRecipeById.query';
import { CreateRecipeCommand } from 'src/recipe/commands/impl/createRecipe.command';
import { UpdateRecipeCommand } from 'src/recipe/commands/impl/updateRecipe.command';
import { FindAllRecipesQuery } from 'src/recipe/queries/impl/findAllRecipes.query';

@Injectable()
export class RecipeService {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

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
    return this.queryBus.execute(new FindRecipeByIdQuery(recipeId));
  }

  async findAllRecipes(query: FindAllRecipesDTO): Promise<RecipeResponse[]> {
    return this.queryBus.execute(new FindAllRecipesQuery(query));
  }
}
