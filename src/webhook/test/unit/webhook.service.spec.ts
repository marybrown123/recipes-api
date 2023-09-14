import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from '../../webhook.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateWebhookDTO } from '../../DTOs/update-webhook.dto';
import { Webhook } from '@prisma/client';

const webhookMock = {
  name: 'testWebhookName',
  url: 'testWebhookUrl',
  isEnabled: true,
  retriesAmount: 5,
};

const newWebhook: UpdateWebhookDTO = {
  url: 'updatedWebhookUrl',
  retriesAmount: 10,
};

describe('Webhook Service - Update and Find All', () => {
  let webhookService: WebhookService;
  let prismaService: PrismaService;
  let testWebhook: Webhook;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [WebhookService, PrismaService],
    }).compile();

    await module.createNestApplication().init();
    webhookService = module.get<WebhookService>(WebhookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    testWebhook = await prismaService.webhook.create({
      data: { ...webhookMock },
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prismaService.webhook.deleteMany();
  });

  it('should update a webhook', async () => {
    const mockPrismaFindFirst = jest.spyOn(prismaService.webhook, 'findFirst');
    const mockPrismaUpdate = jest.spyOn(prismaService.webhook, 'update');

    const result = await webhookService.updateWebhook(
      testWebhook.id,
      newWebhook,
    );

    expect(mockPrismaFindFirst).toBeCalledTimes(1);
    expect(mockPrismaUpdate).toBeCalledTimes(1);
    expect(result.id).toBe(testWebhook.id);
    expect(result.name).toBe(webhookMock.name);
    expect(result.url).toBe(newWebhook.url);
    expect(result.isEnabled).toBe(webhookMock.isEnabled);
    expect(result.retriesAmount).toBe(newWebhook.retriesAmount);
  });

  it('should find all webhooks', async () => {
    const mockPismaFindMany = jest.spyOn(prismaService.webhook, 'findMany');

    const result = await webhookService.fetchAllWebhooks();

    expect(mockPismaFindMany).toBeCalledTimes(1);
    expect(result[0].id).toBe(testWebhook.id);
    expect(result[0].name).toBe(webhookMock.name);
    expect(result[0].url).toBe(webhookMock.url);
    expect(result[0].isEnabled).toBe(webhookMock.isEnabled);
    expect(result[0].retriesAmount).toBe(webhookMock.retriesAmount);
  });
});
