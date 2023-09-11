import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [WebhookService, PrismaService],
  exports: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
