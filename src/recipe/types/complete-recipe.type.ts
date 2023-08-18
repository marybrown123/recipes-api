import {
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';

export type CompleteRecipe = Recipe & {
  preparing: RecipePreparationSteps[];
  ingredients: RecipeIngredients[];
};
