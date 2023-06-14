import { ApiProperty } from '@nestjs/swagger';
import { RecipePreparationSteps } from '@prisma/client';

export class PreparationResponse implements RecipePreparationSteps {
  constructor(preparation: RecipePreparationSteps) {
    this.id = preparation.id;
    this.step = preparation.step;
    this.order = preparation.order;
  }
  @ApiProperty({ example: 1, type: 'number' })
  id: number;
  @ApiProperty({ example: 'Add flour', type: 'string' })
  step: string;
  @ApiProperty({ example: 1, type: 'number' })
  order: number;
  @ApiProperty({ example: 1, type: 'number' })
  recipeId: number;
}
