import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { AuthModule } from '../../../auth/auth.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';

describe('Recipe Controller - Create', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;
  const correctPayload = {
    name: 'testName',
    description: 'testDescription',
    imageURL: 'testImageURL',
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
      property: 'preparing',
      value: 1,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RecipeModule, AuthModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    const testUser = await prisma.user.findFirst({
      where: {
        name: process.env.TEST_NAME,
      },
    });
    accessToken = jwtService.sign({
      name: testUser.name,
      sub: testUser.id,
    });
  });

  it('should create a recipe', async () => {
    const payload = {
      name: 'testName',
      description: 'testDescription',
      imageURL: 'testImageURL',
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
    return request(app.getHttpServer())
      .post('/recipe')
      .send(payload)
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.CREATED);
  });

  it('should throw error on unathourized user', async () => {
    const payload = {
      name: 'testName',
      description: 'testDescription',
      imageURL: 'testImageURL',
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
    return request(app.getHttpServer())
      .post('/recipe')
      .send(payload)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  validationTestsStructure.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      return request(app.getHttpServer())
        .post('/recipe')
        .send(uncorrectPayload)
        .set('Authorization', `bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
