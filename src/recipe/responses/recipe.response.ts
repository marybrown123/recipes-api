import {
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';
import { PreparationResponse } from './preparation.response';
import { CreatePreparingDTO } from '../DTOs/create-preparation.dto';
import { CreateIngredientDTO } from '../DTOs/create-ingredient.dto';
import { IngredientResponse } from './ingredient.response';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecipeResponse implements Recipe {
  constructor(
    recipe: Recipe & { preparing: RecipePreparationSteps[] } & {
      ingredients: RecipeIngredients[];
    },
    fileUrl?: string,
  ) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.description = recipe.description;
    this.fileId = recipe.fileId;
    this.authorId = recipe.authorId;
    this.preparing = recipe.preparing.map((step) => {
      return new PreparationResponse(step);
    });
    this.ingredients = recipe.ingredients.map((ingredient) => {
      return new IngredientResponse(ingredient);
    });
    this.fileUrl = fileUrl;
  }
  @ApiProperty({ example: 1, type: 'string' })
  id: number;

  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name: string;

  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description: string;

  @ApiProperty({ example: 1, type: 'number' })
  fileId: number;

  @ApiProperty({ example: 1, type: 'number' })
  authorId: number;

  @ApiProperty({
    type: CreatePreparingDTO,
    isArray: true,
  })
  preparing: CreatePreparingDTO[];

  @ApiProperty({
    type: CreateIngredientDTO,
    isArray: true,
  })
  ingredients: CreateIngredientDTO[];

  @ApiPropertyOptional({ example: 'fileUrl', type: 'string' })
  fileUrl?: string;
}
