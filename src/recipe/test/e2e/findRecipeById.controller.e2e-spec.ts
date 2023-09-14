import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppModule } from '../../../app.module';
import { CacheServiceMock } from '../../../recipe/test/mocks/cashe.service.mock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WebhookService } from '../../../webhook/webhook.service';
import { WebhookServiceMock } from '../../../webhook/test/mock/webhook.service.mock';

describe('Recipe Controller - Find By Id', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let verifiedUserAccessToken: string;
  let unverifiedUserAccessToken: string;
  let recipeService: RecipeService;
  let userService: UserService;
  let prismaService: PrismaService;
  let testUser: User;
  let unverifiedTestUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CACHE_MANAGER)
      .useClass(CacheServiceMock)
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .overrideProvider(WebhookService)
      .useClass(WebhookServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    recipeService = moduleFixture.get<RecipeService>(RecipeService);
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

  it('should find one recipe by id', async () => {
    await userService.updateVerificationStatus(testUser.id);
    return request(app.getHttpServer())
      .get('/recipe/1')
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error when recipe is not found', async () => {
    await userService.updateVerificationStatus(testUser.id);
    jest.spyOn(recipeService, 'findRecipeById').mockImplementation(() => {
      throw new NotFoundException();
    });
    return request(app.getHttpServer())
      .get('/recipe/2')
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .get('/recipe/1')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw an error on unverified user', async () => {
    return request(app.getHttpServer())
      .get('/recipe/1')
      .set('Authorization', `bearer ${unverifiedUserAccessToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
