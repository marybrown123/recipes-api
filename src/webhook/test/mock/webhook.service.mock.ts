/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';
import { UpdateWebhookDTO } from 'src/webhook/DTOs/update-webhook.dto';
import { WebhookResponse } from 'src/webhook/responses/webhook.response';
import { Webhook } from '@prisma/client';

export class WebhookServiceMock implements Required<WebhookService> {
  generateTestWebhook(): Webhook {
    return {
      id: 1,
      name: 'testWebhookName',
      url: 'testWebhookUrl',
      isEnabled: true,
      retriesAmount: 5,
    };
  }

  generateWebhookResponse(): WebhookResponse {
    return new WebhookResponse(this.generateTestWebhook());
  }

  async sendWebhookWithRecipe(_recipe: RecipeResponse): Promise<void> {}

  async updateWebhook(
    _webhookId: number,
    _newWebhook: UpdateWebhookDTO,
  ): Promise<WebhookResponse> {
    return this.generateWebhookResponse();
  }
}
