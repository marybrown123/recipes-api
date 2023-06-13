import {
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';
import { PreparationResponse } from './preparation.response';
import { CreatePreparingDTO } from '../DTOs/create-preparation.dto';
import { CreateIngredientDTO } from '../DTOs/create-ingredient.dto';
import { IngredientResponse } from './ingredient.response';
import { ApiProperty } from '@nestjs/swagger';

export class RecipeResponse implements Recipe {
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
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Dumplings' })
  name: string;
  @ApiProperty({ example: 'Easy dumplings recipe' })
  description: string;
  @ApiProperty({ example: 'imageURL' })
  imageURL: string;
  @ApiProperty({ example: 1 })
  authorId: number;
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing: CreatePreparingDTO[];
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients: CreateIngredientDTO[];
}
