/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Recipe, User, WebhookEventStatus } from '@prisma/client';
import { WebhookName } from 'src/webhook/enums/webhookName.enum';
import { WebhookEventHandler } from 'src/webhook/webhook-event.handler';

export class WebhookEventHandlerMock implements Required<WebhookEventHandler> {
  async createWebhookEvent(
    _webhookName: WebhookName,
    _payload: Recipe | User,
  ): Promise<void> {}
  async triggerWebhookEvents(): Promise<void> {}
  async updateWebhookEventStatus(
    _webhookEventId: number,
    _status: WebhookEventStatus,
  ): Promise<void> {}
}
