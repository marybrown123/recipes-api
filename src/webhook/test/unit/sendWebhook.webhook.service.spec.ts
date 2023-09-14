import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { WebhookName } from '../../enums/webhookName.enum';

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

const recipeCreatedWebhookMock = {
  id: 1,
  name: WebhookName.RecipeCreatedWebhook,
  url: 'mockedUrl',
  isEnabled: true,
  retriesAmount: 5,
};

describe('Webhook Service - Send Webhook', () => {
  let webhookService: WebhookService;
  let httpService: HttpService;
  let httpPost: jest.SpyInstance<
    Observable<AxiosResponse<unknown, any>>,
    [url: string, data?: any, config?: AxiosRequestConfig<any>]
  >;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [WebhookService, PrismaService],
    }).compile();

    await module.createNestApplication().init();
    webhookService = module.get<WebhookService>(WebhookService);
    httpService = module.get<HttpService>(HttpService);
  });

  beforeEach(async () => {
    httpPost = jest.spyOn(httpService, 'post').mockImplementation(jest.fn());
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should send a webhook', async () => {
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

    const mockFetchOneByName = jest
      .spyOn(webhookService, 'fetchOneWebhookByName')
      .mockResolvedValue(recipeCreatedWebhookMock);

    await webhookService.sendWebhook(
      recipeForWebhook,
      WebhookName.RecipeCreatedWebhook,
    );
    expect(mockFetchOneByName).toBeCalledTimes(1);
    expect(httpPost).toBeCalledTimes(1);
  });

  it('should throw an error when call fails with status 500', async () => {
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

    const mockFetchOneByName = jest
      .spyOn(webhookService, 'fetchOneWebhookByName')
      .mockResolvedValue(recipeCreatedWebhookMock);

    try {
      await webhookService.sendWebhook(
        recipeForWebhook,
        WebhookName.RecipeCreatedWebhook,
      );
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(mockFetchOneByName).toBeCalledTimes(1);
  });

  it('should throw an error when call fails with status 400', async () => {
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

    const mockFetchOneByName = jest
      .spyOn(webhookService, 'fetchOneWebhookByName')
      .mockResolvedValue(recipeCreatedWebhookMock);

    try {
      await webhookService.sendWebhook(
        recipeForWebhook,
        WebhookName.RecipeCreatedWebhook,
      );
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(mockFetchOneByName).toBeCalledTimes(1);
  });
});
