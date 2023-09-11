import {
  CanActivate,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { IsUserAuthorGuard } from '../../../user/guards/is-user-author.guard';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppModule } from '../../../app.module';
import { WebhookService } from '../../../webhook/webhook.service';
import { WebhookServiceMock } from '../../../webhook/test/mock/webhook.service.mock';

describe('Recipe Controller - Update', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;
  let verifiedUserAccessToken: string;
  let unverifiedUserAccessToken: string;
  let prismaService: PrismaService;
  let testUser: User;
  let unverifiedTestUser: User;
  const fakeGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const correctPayload: UpdateRecipeDTO = {
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
      .overrideGuard(IsUserAuthorGuard)
      .useValue(fakeGuard)
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

  it('should update a recipe', async () => {
    return request(app.getHttpServer())
      .patch('/recipe/1')
      .send(correctPayload)
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .patch('/recipe/1')
      .send(correctPayload)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw error on unverified user', async () => {
    return request(app.getHttpServer())
      .patch('/recipe/1')
      .send(correctPayload)
      .set('Authorization', `bearer ${unverifiedUserAccessToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  validationTestsStructure.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      return request(app.getHttpServer())
        .patch('/recipe/1')
        .send(uncorrectPayload)
        .set('Authorization', `bearer ${verifiedUserAccessToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
