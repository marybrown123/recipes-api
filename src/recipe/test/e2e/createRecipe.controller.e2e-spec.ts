import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { RecipeService } from '../../recipe.service';
import { JwtService } from '@nestjs/jwt';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { CreateRecipeDTO } from '../../../recipe/DTOs/create-recipe.dto';
import { Role, User } from '@prisma/client';
import { UserService } from '../../../user/user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppModule } from '../../../app.module';
import { WebhookService } from '../../../webhook/webhook.service';
import { WebhookServiceMock } from '../../../webhook/test/mock/webhook.service.mock';

describe('Recipe Controller - Create', () => {
  let app: INestApplication;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let testUser: User;
  let unverifiedTestUser: User;
  let verifiedUserAccessToken: string;
  let unverifiedUserAccessToken: string;
  const correctPayload: CreateRecipeDTO = {
    name: 'testName',
    description: 'testDescription',
    fileId: 1,
    preparing: [
      {
        step: 'testStep',
        order: 1,
      },
    ],
    ingredients: [
      {
        name: 'testName',
        amount: 'testAmount',
      },
    ],
  };
  const validationTestsStructure = [
    {
      property: 'name',
      value: 1,
    },
    {
      property: 'description',
      value: 1,
    },
    {
      property: 'fileId',
      value: 'test',
    },
    {
      property: 'preparing',
      value: 1,
    },
    {
      property: 'ingredients',
      value: 1,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .overrideProvider(WebhookService)
      .useClass(WebhookServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    testUser = await userService.generateAccount(
      process.env.TEST_EMAIL,
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );

    await userService.updateVerificationStatus(testUser.id);

    verifiedUserAccessToken = jwtService.sign({
      name: testUser.name,
      sub: testUser.id,
    });

    unverifiedTestUser = await userService.generateAccount(
      process.env.TEST_UNVERIFIED_EMAIL,
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );

    unverifiedUserAccessToken = jwtService.sign({
      name: unverifiedTestUser.name,
      sub: unverifiedTestUser.id,
    });
  });

  afterAll(async () => {
    await prismaService.user.delete({ where: { id: testUser.id } });
    await app.close();
  });

  it('should create a recipe', async () => {
    await userService.updateVerificationStatus(testUser.id);
    return request(app.getHttpServer())
      .post('/recipe')
      .send(correctPayload)
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.CREATED);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .post('/recipe')
      .send(correctPayload)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw an error on unverified user', async () => {
    return request(app.getHttpServer())
      .post('/recipe')
      .send(correctPayload)
      .set('Authorization', `bearer ${unverifiedUserAccessToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  validationTestsStructure.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      await userService.updateVerificationStatus(testUser.id);
      return request(app.getHttpServer())
        .post('/recipe')
        .send(uncorrectPayload)
        .set('Authorization', `bearer ${verifiedUserAccessToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
