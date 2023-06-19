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
      .expect(HttpStatus.CREATED)
      .then((res) => {
        console.log(res.body);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBe('testName');
        expect(res.body.description).toBe('testDescription');
        expect(res.body.imageURL).toBe('testImageURL');
        expect(res.body.preparing[0].step).toBe('testStep');
        expect(res.body.preparing[0].order).toBe(1);
        expect(res.body.ingredients[0].name).toBe('testName');
        expect(res.body.ingredients[0].amount).toBe('testAmount');
      });
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

  it('should throw validation error when property name is number', async () => {
    const payload = {
      name: 1,
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
      .expect(HttpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body).toMatchSnapshot();
      });
  });

  it('should throw validation error when property description is number', async () => {
    const payload = {
      name: 'testName',
      description: 1,
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
      .expect(HttpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body).toMatchSnapshot();
      });
  });

  it('should throw validation error when property order in preparing is string', async () => {
    const payload = {
      name: 'testName',
      description: 'testDescription',
      imageURL: 'testImageURL',
      preparing: [
        {
          step: 'testStep',
          order: 'testOrder',
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
      .expect(HttpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body).toMatchSnapshot();
      });
  });
});
