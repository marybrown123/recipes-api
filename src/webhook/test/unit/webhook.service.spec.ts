import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';

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

describe('Webhook Service', () => {
  let webhookService: WebhookService;
  let httpService: HttpService;
  let httpPost: jest.SpyInstance<
    Observable<AxiosResponse<unknown, any>>,
    [url: string, data?: any, config?: AxiosRequestConfig<any>]
  >;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
});
