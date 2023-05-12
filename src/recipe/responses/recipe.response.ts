import {
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';
import { PreparationResponse } from './preparation.response';
import { CreatePreparingDTO } from '../DTOs/create-preparation.dto';
import { CreateIngredientDTO } from '../DTOs/create-ingredient.dto';
import { IngredientResponse } from './ingredient.response';

export class RecipeResponse {
  constructor(
    recipe: Recipe & { preparing: RecipePreparationSteps[] } & {
      ingredients: RecipeIngredients[];
    },
  ) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.description = recipe.description;
    this.imageURL = recipe.imageURL;
    this.authorId = recipe.authorId;
    this.preparing = recipe.preparing.map((step) => {
      return new PreparationResponse(step);
    });
    this.ingredients = recipe.ingredients.map((ingredient) => {
      return new IngredientResponse(ingredient);
    });
  }
  id: number;
  name: string;
  description: string;
  imageURL: string;
  authorId: number;
  preparing: CreatePreparingDTO[];
  ingredients: CreateIngredientDTO[];
}
