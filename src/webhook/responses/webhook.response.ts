import { ApiProperty } from '@nestjs/swagger';
import { Webhook } from '@prisma/client';

export class WebhookResponse implements Webhook {
  constructor(webhook: Webhook) {
    this.id = webhook.id;
    this.name = webhook.name;
    this.url = webhook.url;
    this.isEnabled = webhook.isEnabled;
    this.retriesAmount = webhook.retriesAmount;
  }
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'exampleWebhookName' })
  name: string;

  @ApiProperty({ type: 'string', example: 'exampleWebhookUrl' })
  url: string;

  @ApiProperty({ type: 'boolean', example: true })
  isEnabled: boolean;

  @ApiProperty({ type: 'number', example: 5 })
  retriesAmount: number;
}
