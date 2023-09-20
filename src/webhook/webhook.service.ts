import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWebhookDTO } from './DTOs/update-webhook.dto';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookResponse } from './responses/webhook.response';
import { WebhookName } from './enums/webhookName.enum';

@Injectable()
export class WebhookService {
  constructor(private readonly prismaService: PrismaService) {}
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
