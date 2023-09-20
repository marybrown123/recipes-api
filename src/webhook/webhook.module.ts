import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookEventHandler } from './webhook.event-handler';

@Module({
  imports: [HttpModule],
  providers: [WebhookService, PrismaService, WebhookEventHandler],
  exports: [WebhookService, WebhookEventHandler],
  controllers: [WebhookController],
})
export class WebhookModule {}
