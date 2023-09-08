import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { lastValueFrom } from 'rxjs';
import { UpdateWebhookDTO } from './DTOs/update-webhook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhookResponse } from 'src/webhook/responses/webhook.response';

@Injectable()
export class WebhookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  async sendWebhookWithRecipe(recipe: RecipeResponse): Promise<void> {
    const webhookURL = process.env.WEBHOOK_URL;

    try {
      await lastValueFrom(this.httpService.post(webhookURL, recipe));
    } catch (error) {
      throw new Error('There was an error while sending request');
    }
  }

  async updateWebhook(
    webhookId: number,
    newWebhook: UpdateWebhookDTO,
  ): Promise<WebhookResponse> {
    const webhookToUpdate = await this.prismaService.webhook.findFirst({
      where: { id: webhookId },
    });

    if (!webhookToUpdate) {
      throw new NotFoundException();
    }

    const updatedWebhook = await this.prismaService.webhook.update({
      where: { id: webhookId },
      data: {
        ...newWebhook,
      },
    });

    return new WebhookResponse(updatedWebhook);
  }
}
