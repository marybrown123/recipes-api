import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { UserResponse } from '../../../user/responses/user.response';
import { WebhookService } from '../../webhook.service';
import { PrismaService } from '../../../prisma/prisma.service';

const userForWebhook: UserResponse = {
  id: 1,
  name: 'mockName',
  email: 'mockEmail',
  isVerified: true,
  roles: [Role.USER],
};

const verifyUserWebhookMock = {
  id: 1,
  name: process.env.VERIFY_USER_WEBHOOK_NAME,
  url: 'mockedUrl',
  isEnabled: true,
  retriesAmount: 5,
};

describe('Webhook Service - Verify User Webhook', () => {
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

  it('should send a verify user webhook', async () => {
    const response: AxiosResponse<any> = {
      data: userForWebhook,
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

    const mockFetchAllWebhooks = jest
      .spyOn(webhookService, 'fetchAllWebhooks')
      .mockResolvedValue([verifyUserWebhookMock]);

    await webhookService.verifyUserWebhook(userForWebhook);
    expect(mockFetchAllWebhooks).toBeCalledTimes(1);
    expect(httpPost).toBeCalledTimes(1);
  });

  it('should throw an error when call fails with status 400 - verify user webhook', async () => {
    const response: AxiosResponse<any> = {
      data: userForWebhook,
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

    const mockFetchAllWebhooks = jest
      .spyOn(webhookService, 'fetchAllWebhooks')
      .mockResolvedValue([verifyUserWebhookMock]);

    try {
      await webhookService.verifyUserWebhook(userForWebhook);
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(mockFetchAllWebhooks).toBeCalledTimes(1);
  });

  it('should throw an error when call fails with status 500 - verify user webhook', async () => {
    const response: AxiosResponse<any> = {
      data: userForWebhook,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl',
        headers: undefined,
      },
      status: 500,
      statusText: 'Bad request',
    };

    httpPost = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of(response));

    const mockFetchAllWebhooks = jest
      .spyOn(webhookService, 'fetchAllWebhooks')
      .mockResolvedValue([verifyUserWebhookMock]);

    try {
      await webhookService.verifyUserWebhook(userForWebhook);
    } catch (error) {
      expect(error.message).toBe('There was an error while sending request');
    }

    expect(httpPost).toBeCalledTimes(1);
    expect(mockFetchAllWebhooks).toBeCalledTimes(1);
  });
});
