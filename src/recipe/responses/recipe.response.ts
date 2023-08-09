import {
  Image,
  Recipe,
  RecipeIngredients,
  RecipePreparationSteps,
} from '@prisma/client';
import { PreparationResponse } from './preparation.response';
import { CreatePreparingDTO } from '../DTOs/create-preparation.dto';
import { CreateIngredientDTO } from '../DTOs/create-ingredient.dto';
import { IngredientResponse } from './ingredient.response';
import { ApiProperty } from '@nestjs/swagger';
import { ImageResponse } from '../responses/image.response';
import { CreateImageDTO } from '../DTOs/create-image.dto';

export class RecipeResponse implements Recipe {
  constructor(
    recipe: Recipe & { preparing: RecipePreparationSteps[] } & {
      ingredients: RecipeIngredients[];
    } & { image: Image },
  ) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.description = recipe.description;
    this.image = new ImageResponse(recipe.image);
    this.authorId = recipe.authorId;
    this.preparing = recipe.preparing.map((step) => {
      return new PreparationResponse(step);
    });
    this.ingredients = recipe.ingredients.map((ingredient) => {
      return new IngredientResponse(ingredient);
    });
  }
  @ApiProperty({ example: 1, type: 'string' })
  id: number;
  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name: string;
  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description: string;
  @ApiProperty({ example: 'imageKey', type: 'string' })
  image: CreateImageDTO;
  @ApiProperty({ example: 1, type: 'number' })
  authorId: number;
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing: CreatePreparingDTO[];
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients: CreateIngredientDTO[];
}
