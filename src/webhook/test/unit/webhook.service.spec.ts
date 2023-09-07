import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import axios from 'axios';
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { WebhookService } from '../../webhook.service';

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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await module.createNestApplication().init();
    webhookService = module.get<WebhookService>(WebhookService);
  });

  it('should send a webhook', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const webhookUrl = process.env.WEBHOOK_URL;

    await webhookService.sendWebhookWithRecipe(recipeForWebhook);

    expect(axiosPost).toBeCalledTimes(1);
    expect(axiosPost).toBeCalledWith(webhookUrl, recipeForWebhook);
  });
});
