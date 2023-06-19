import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { AuthModule } from '../../../auth/auth.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Recipe Controller - Create', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;

  const mockRecipeService = {
    createRecipe: jest.fn().mockImplementation((dto, id) => {
      return {
        id: 1,
        ...dto,
        authorId: id,
      };
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RecipeModule, AuthModule],
    })
      .overrideProvider(RecipeService)
      .useValue(mockRecipeService)
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
      .expect(201)
      .then((res) => {
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
      .expect(401);
  });

  it('should throw validation error', async () => {
    const payload = {
      name: 1,
      description: 1,
      imageURL: 1,
      preparing: 1,
      ingredients: 1,
    };

    return request(app.getHttpServer())
      .post('/recipe')
      .send(payload)
      .set('Authorization', `bearer ${accessToken}`)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain('name must be a string');
        expect(res.body.message).toContain('description must be a string');
        expect(res.body.message).toContain('imageURL must be a string');
        expect(res.body.message).toContain(
          'nested property preparing must be either object or array',
        );
        expect(res.body.message).toContain(
          'nested property ingredients must be either object or array',
        );
      });
  });
});
