import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  async sendWebhookWithRecipe(recipe: RecipeResponse): Promise<void> {
    const webhookURL = process.env.WEBHOOK_URL;

    try {
      await lastValueFrom(this.httpService.post(webhookURL, recipe));
    } catch (error) {
      throw new Error('There was an error while sending request');
    }
  }
}
