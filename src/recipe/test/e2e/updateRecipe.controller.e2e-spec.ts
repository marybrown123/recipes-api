import {
  CanActivate,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecipeModule } from '../../../recipe/recipe.module';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { AuthModule } from '../../../auth/auth.module';
import { IsUserAuthorGuard } from '../../../user/guards/is-user-author.guard';

describe('Recipe Controller - Update', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let accessToken: string;
  const fakeGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const correctPayload: UpdateRecipeDTO = {
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
      .overrideGuard(IsUserAuthorGuard)
      .useValue(fakeGuard)
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

  it('should update a recipe', async () => {
    return request(app.getHttpServer())
      .patch('/recipe/1')
      .send(correctPayload)
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .patch('/recipe/1')
      .send(correctPayload)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  validationTestsStructure.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      return request(app.getHttpServer())
        .patch('/recipe/1')
        .send(uncorrectPayload)
        .set('Authorization', `bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
