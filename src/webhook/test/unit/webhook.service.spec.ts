import { Test, TestingModule } from '@nestjs/testing';
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateWebhookDTO } from '../../DTOs/update-webhook.dto';
import { Webhook } from '@prisma/client';

const recipeForWebhook: RecipeResponse = {
  id: 1,
  name: 'testName',
  description: 'testDescription',
  fileId: 1,
  authorId: 1,
  preparing: [
    {
      step: 'testStep',
      order: 1,
    },
  ],
  ingredients: [
    {
      name: 'testName',
      amount: 'testAmout',
    },
  ],
  fileUrl: 'testFileUrl',
};

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

describe('Webhook Service', () => {
  let webhookService: WebhookService;
  let httpService: HttpService;
  let httpPost: jest.SpyInstance<
    Observable<AxiosResponse<unknown, any>>,
    [url: string, data?: any, config?: AxiosRequestConfig<any>]
  >;
  let prismaService: PrismaService;
  let testWebhook: Webhook;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [WebhookService, PrismaService],
    }).compile();

    await module.createNestApplication().init();
    webhookService = module.get<WebhookService>(WebhookService);
    httpService = module.get<HttpService>(HttpService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    httpPost = jest.spyOn(httpService, 'post').mockImplementation(jest.fn());
    testWebhook = await prismaService.webhook.create({
      data: { ...webhookMock },
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prismaService.webhook.deleteMany();
  });

  it('should send a webhook', async () => {
    const webhookUrl = process.env.WEBHOOK_URL;

    const response: AxiosResponse<any> = {
      data: recipeForWebhook,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl',
        headers: undefined,
      },
      status: 200,
      statusText: 'OK',
    };

    httpPost = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of(response));

    await webhookService.sendWebhookWithRecipe(recipeForWebhook);

    expect(httpPost).toBeCalledTimes(1);
    expect(httpPost).toBeCalledWith(webhookUrl, recipeForWebhook);
  });

  it('should throw an error when call fails with status 500', async () => {
    const webhookUrl = process.env.WEBHOOK_URL;

    const response: AxiosResponse<any> = {
      data: recipeForWebhook,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl',
        headers: undefined,
      },
      status: 500,
      statusText: 'Internal server error',
    };

    httpPost = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of(response));

    try {
      await webhookService.sendWebhookWithRecipe(recipeForWebhook);
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(httpPost).toBeCalledWith(webhookUrl, recipeForWebhook);
  });

  it('should throw an error when call fails with status 400', async () => {
    const webhookUrl = process.env.WEBHOOK_URL;

    const response: AxiosResponse<any> = {
      data: recipeForWebhook,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl',
        headers: undefined,
      },
      status: 400,
      statusText: 'Bad request',
    };

    httpPost = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of(response));

    try {
      await webhookService.sendWebhookWithRecipe(recipeForWebhook);
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(httpPost).toBeCalledWith(webhookUrl, recipeForWebhook);
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
});
