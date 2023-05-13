import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredients } from '@prisma/client';

export class IngredientResponse {
  constructor(ingredient: RecipeIngredients) {
    this.name = ingredient.name;
    this.amount = ingredient.amount;
    this.id = ingredient.id;
  }
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'flour' })
  name: string;
  @ApiProperty({ example: 'three spoons' })
  amount: string;
}
