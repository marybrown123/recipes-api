import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { RecipeService } from '../../../recipe/recipe.service';
import { CreateRecipeDTO } from '../../../recipe/DTOs/create-recipe.dto';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { FindAllRecipesQuery } from '../../../common/find-all-recipes-query';
import {
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';

export class RecipeServiceMock implements Required<RecipeService> {
  private generateRecipeResponse(): RecipeResponse {
    const recipeToReturn: Recipe & { preparing: RecipePreparationSteps[] } & {
      ingredients: RecipeIngredients[];
    } = {
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

    return new RecipeResponse(recipeToReturn);
  }

  async createRecipe(
    recipe: CreateRecipeDTO,
    authorId: number,
  ): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async updateRecipe(
    recipeId: number,
    newRecipe: UpdateRecipeDTO,
  ): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async findAllRecipes(query: FindAllRecipesQuery): Promise<RecipeResponse[]> {
    return [this.generateRecipeResponse()];
  }

  async findRecipeById(recipeId: number): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async findRecipeByName(query: string): Promise<RecipeResponse[]> {
    return [this.generateRecipeResponse()];
  }
}
