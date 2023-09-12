/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';
import { UpdateWebhookDTO } from '../../DTOs/update-webhook.dto';
import { WebhookResponse } from '../../responses/webhook.response';
import { Webhook } from '@prisma/client';
import { UserResponse } from 'src/user/responses/user.response';

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

  async createRecipeWebhook(_recipe: RecipeResponse): Promise<void> {}

  async verifyUserWebhook(_user: UserResponse): Promise<void> {}

  async deleteRecipeWebhook(_recipe: RecipeResponse): Promise<void> {}

  async updateWebhook(
    _webhookId: number,
    _newWebhook: UpdateWebhookDTO,
  ): Promise<WebhookResponse> {
    return this.generateWebhookResponse();
  }

  async fetchAllWebhooks(): Promise<WebhookResponse[]> {
    return [this.generateWebhookResponse()];
  }
}
