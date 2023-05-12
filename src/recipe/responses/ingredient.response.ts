import { RecipeIngredients } from '@prisma/client';

export class IngredientResponse {
  constructor(ingredient: RecipeIngredients) {
    this.name = ingredient.name;
    this.amount = ingredient.amount;
  }
  name: string;
  amount: string;
}
