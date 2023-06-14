import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredients } from '@prisma/client';

export class IngredientResponse implements RecipeIngredients {
  constructor(ingredient: RecipeIngredients) {
    this.name = ingredient.name;
    this.amount = ingredient.amount;
    this.id = ingredient.id;
  }
  @ApiProperty({ example: 1, type: 'number' })
  id: number;
  @ApiProperty({ example: 'flour', type: 'string' })
  name: string;
  @ApiProperty({ example: 'three spoons', type: 'string' })
  amount: string;
  @ApiProperty({ example: 1, type: 'number' })
  recipeId: number;
}
