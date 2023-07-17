import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { RecipeModule } from '../../recipe.module';
import { RecipeService } from '../../recipe.service';
import { AuthModule } from '../../../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { CreateRecipeDTO } from '../../../recipe/DTOs/create-recipe.dto';
import { Role, User } from '@prisma/client';
import { UserService } from '../../../user/user.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('Recipe Controller - Create', () => {
  let app: INestApplication;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;
  let testUser: User;
  const correctPayload: CreateRecipeDTO = {
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
      property: 'imageURL',
      value: 1,
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
      imports: [RecipeModule, AuthModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    testUser = await userService.generateAccount(
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );
    accessToken = jwtService.sign({
      name: testUser.name,
      sub: testUser.id,
    });
  });

  it('should create a recipe', async () => {
    return request(app.getHttpServer())
      .post('/recipe')
      .send(correctPayload)
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.CREATED);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .post('/recipe')
      .send(correctPayload)
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
