import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateWebhookDTO } from './DTOs/update-webhook.dto';
import { WebhookService } from './webhook.service';
import { WebhookResponse } from './responses/webhook.response';
import { AuthGuard } from '@nestjs/passport';
import { IsAdminGuard } from '../user/guards/is-admin.guard';

@ApiTags('webhook')
@Controller('/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @ApiOperation({ summary: 'Update a webhook' })
  @ApiCreatedResponse({ type: WebhookResponse })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({ name: 'id', required: true })
  async updateWebhook(
    @Param('id') webhookId: number,
    @Body() newWebhook: UpdateWebhookDTO,
  ): Promise<WebhookResponse> {
    return this.webhookService.updateWebhook(webhookId, newWebhook);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @ApiOperation({ summary: 'Fetch all webhooks' })
  @ApiOkResponse({ type: [WebhookResponse] })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  async fetchAllWebhooks(): Promise<WebhookResponse[]> {
    return this.webhookService.fetchAllWebhooks();
  }
}
