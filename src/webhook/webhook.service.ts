import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';

export class WebhookService {
  async sendWebhookWithRecipe(recipe: RecipeResponse): Promise<void> {
    const webhookURL = process.env.WEBHOOK_URL;
    const webhookData = {
      ...recipe,
    };

    try {
      await axios.post(webhookURL, webhookData);
    } catch (error) {
      throw Error('There was an error while sending a request');
    }
  }
}
