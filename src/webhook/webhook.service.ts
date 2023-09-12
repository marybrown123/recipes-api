import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { lastValueFrom } from 'rxjs';
import { UpdateWebhookDTO } from './DTOs/update-webhook.dto';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookResponse } from './responses/webhook.response';
import { UserResponse } from 'src/user/responses/user.response';

@Injectable()
export class WebhookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  async createRecipeWebhook(recipe: RecipeResponse): Promise<void> {
    const webhooks = await this.fetchAllWebhooks();

    const createRecipeWebhook = webhooks.filter((webhook) => {
      if (webhook.name === process.env.CREATE_RECIPE_WEBHOOK_NAME) {
        return webhook;
      }
    });

    if (createRecipeWebhook[0].isEnabled) {
      const webhookURL = createRecipeWebhook[0].url;

      try {
        await lastValueFrom(this.httpService.post(webhookURL, recipe));
      } catch (error) {
        throw new Error('There was an error while sending request');
      }
    }
  }

  async verifyUserWebhook(user: UserResponse): Promise<void> {
    const webhooks = await this.fetchAllWebhooks();

    const verifyUserWebhook = webhooks.filter((webhook) => {
      if (webhook.name === process.env.VERIFY_USER_WEBHOOK_NAME) {
        return webhook;
      }
    });

    if (verifyUserWebhook[0].isEnabled) {
      const webhookURL = verifyUserWebhook[0].url;

      try {
        await lastValueFrom(this.httpService.post(webhookURL, user));
      } catch (error) {
        throw new Error('There was an error while sending request');
      }
    }
  }

  async deleteRecipeWebhook(recipe: RecipeResponse): Promise<void> {
    const webhooks = await this.fetchAllWebhooks();

    const deleteRecipeWebhook = webhooks.filter((webhook) => {
      if (webhook.name === process.env.DELETE_RECIPE_WEBHOOK_NAME) {
        return webhook;
      }
    });

    if (deleteRecipeWebhook[0].isEnabled) {
      const webhookURL = deleteRecipeWebhook[0].url;

      try {
        await lastValueFrom(this.httpService.post(webhookURL, recipe));
      } catch (error) {
        throw new Error('There was an error while sending request');
      }
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

  async fetchAllWebhooks(): Promise<WebhookResponse[]> {
    const webhooks = await this.prismaService.webhook.findMany();
    return webhooks.map((webhook) => {
      return new WebhookResponse(webhook);
    });
  }
}
