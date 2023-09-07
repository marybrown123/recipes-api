import axios from 'axios';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';

export class WebhookService {
  async sendWebhookWithRecipe(recipe: RecipeResponse): Promise<void> {
    const webhookURL = process.env.WEBHOOK_URL;
    const webhookData = {
      ...recipe,
    };

    await axios.post(webhookURL, webhookData);
  }
}
