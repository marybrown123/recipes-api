import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Recipe, User, WebhookEventStatus } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookName } from './enums/webhookName.enum';
import { WebhookService } from './webhook.service';

@Injectable()
export class WebhookEventHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly webhookService: WebhookService,
  ) {}
  async createWebhookEvent(
    webhookName: WebhookName,
    payload: Recipe | User,
  ): Promise<void> {
    const webhook = await this.webhookService.fetchOneWebhookByName(
      webhookName,
    );

    await this.prismaService.webhookEvent.create({
      data: {
        webhook: {
          connect: {
            id: webhook.id,
          },
        },
        payload,
        retriesLeft: webhook.retriesAmount,
      },
    });
  }

  @Interval(5000)
  async triggerWebhookEvents() {
    const webhookEvents = await this.prismaService.webhookEvent.findMany({
      where: { status: WebhookEventStatus.Pending },
      include: { webhook: true },
    });

    if (webhookEvents) {
      webhookEvents.forEach(async (webhookEvent) => {
        if (webhookEvent.webhook.isEnabled) {
          try {
            await this.prismaService.webhookEvent.update({
              where: { id: webhookEvent.id },
              data: { retriesLeft: webhookEvent.retriesLeft - 1 },
            });
            await lastValueFrom(
              this.httpService.post(
                webhookEvent.webhook.url,
                webhookEvent.payload,
              ),
            );
            await this.updateWebhookEventStatus(
              webhookEvent.id,
              WebhookEventStatus.Succed,
            );
          } catch (error) {
            const webhookEventFromDb =
              await this.prismaService.webhookEvent.findFirst({
                where: { id: webhookEvent.id },
              });
            if (webhookEventFromDb.retriesLeft === 0) {
              await this.updateWebhookEventStatus(
                webhookEvent.id,
                WebhookEventStatus.Failed,
              );
            }
          }
        }
      });
    }
  }

  async updateWebhookEventStatus(
    webhookEventId: number,
    status: WebhookEventStatus,
  ) {
    await this.prismaService.webhookEvent.update({
      where: { id: webhookEventId },
      data: { status },
    });
  }
}
