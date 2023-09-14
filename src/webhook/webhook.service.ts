import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UpdateWebhookDTO } from './DTOs/update-webhook.dto';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookResponse } from './responses/webhook.response';
import { WebhookName } from './enums/webhookName.enum';

@Injectable()
export class WebhookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}
  async sendWebhook<T>(
    webhookPayload: T,
    webhookName: WebhookName,
  ): Promise<void> {
    const webhookFromDb = await this.fetchOneWebhookByName(webhookName);

    if (webhookFromDb.isEnabled) {
      try {
        await lastValueFrom(
          this.httpService.post(webhookFromDb.url, webhookPayload),
        );
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

  async fetchOneWebhookByName(
    webhookName: WebhookName,
  ): Promise<WebhookResponse> {
    const webhookFromDb = await this.prismaService.webhook.findFirst({
      where: { name: webhookName },
    });
    return new WebhookResponse(webhookFromDb);
  }
}
