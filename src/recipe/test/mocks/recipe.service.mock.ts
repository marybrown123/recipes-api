import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { RecipeService } from '../../../recipe/recipe.service';
import { CreateRecipeDTO } from 'src/recipe/DTOs/create-recipe.dto';
import { UpdateRecipeDTO } from 'src/recipe/DTOs/update-recipe.dto';
import { FindAllRecipesQuery } from 'src/common/find-all-recipes-query';

export class RecipeServiceMock implements Required<RecipeService> {
  async createRecipe(
    recipe: CreateRecipeDTO,
    authorId: number,
  ): Promise<RecipeResponse> {
    const preparingToReturn = recipe.preparing.map((step) => {
      return { ...step, recipeId: 1, id: 1 };
    });

    const ingredientsToReturn = recipe.ingredients.map((ingredient) => {
      return { ...ingredient, recipeId: 1, id: 1 };
    });

    const recipeToReturn = {
      id: 1,
      name: recipe.name,
      description: recipe.description,
      imageURL: recipe.imageURL,
      preparing: preparingToReturn,
      ingredients: ingredientsToReturn,
      authorId,
    };

    return new RecipeResponse(recipeToReturn);
  }

  async updateRecipe(
    recipeId: number,
    newRecipe: UpdateRecipeDTO,
  ): Promise<RecipeResponse> {
    const preparingToReturn = newRecipe.preparing.map((step) => {
      return { ...step, id: 1, recipeId };
    });

    const ingredientsToReturn = newRecipe.ingredients.map((ingredient) => {
      return { ...ingredient, id: 1, recipeId };
    });

    const recipeToReturn = {
      id: recipeId,
      name: newRecipe.name,
      description: newRecipe.description,
      imageURL: newRecipe.imageURL,
      preparing: preparingToReturn,
      ingredients: ingredientsToReturn,
      authorId: 1,
    };

    return new RecipeResponse(recipeToReturn);
  }

  async findAllRecipes(query: FindAllRecipesQuery): Promise<RecipeResponse[]> {
    const recipesToReturn = [
      {
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
      },
    ];

    return recipesToReturn.map((recipe) => {
      return new RecipeResponse(recipe);
    });
  }

  async findRecipeById(recipeId: number): Promise<RecipeResponse> {
    const recipeToReturn = {
      id: recipeId,
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

  async findRecipeByName(query: string): Promise<RecipeResponse[]> {
    const recipesToReturn = [
      {
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
      },
    ];

    recipesToReturn.map((recipe) => {
      return new RecipeResponse(recipe);
    });
  }
}
