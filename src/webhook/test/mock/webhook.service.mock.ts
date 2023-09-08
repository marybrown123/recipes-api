/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';

export class WebhookServiceMock implements Required<WebhookService> {
  async sendWebhookWithRecipe(_recipe: RecipeResponse): Promise<void> {}
}
