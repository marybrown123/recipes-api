import { RecipePreparationSteps } from '@prisma/client';

export class PreparationResponse {
  constructor(preparation: RecipePreparationSteps) {
    this.id = preparation.id;
    this.step = preparation.step;
    this.order = preparation.order;
  }
  id: number;
  step: string;
  order: number;
}
