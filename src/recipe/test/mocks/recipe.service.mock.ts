/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { RecipeService } from '../../../recipe/recipe.service';
import { CreateRecipeDTO } from '../../../recipe/DTOs/create-recipe.dto';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { FindAllRecipesDTO } from '../../DTOs/find-all-recipes-query';
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
      imageKey: 'testImageKey',
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
    _recipe: CreateRecipeDTO,
    _authorId: number,
  ): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async uploadRecipeImage(
    _recipeId: number,
    _file: Express.Multer.File,
  ): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async fetchRecipeImage(_recipeId: number) {
    return 'mockedIUrl';
  }

  async updateRecipe(
    _recipeId: number,
    _newRecipe: UpdateRecipeDTO,
  ): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }

  async findAllRecipes(_query: FindAllRecipesDTO): Promise<RecipeResponse[]> {
    return [this.generateRecipeResponse()];
  }

  async findRecipeById(_recipeId: number): Promise<RecipeResponse> {
    return this.generateRecipeResponse();
  }
}
