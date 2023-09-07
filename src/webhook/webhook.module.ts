import { Module } from '@nestjs/common';
import { WebhookService } from 'src/webhook/webhook.service';

@Module({
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
