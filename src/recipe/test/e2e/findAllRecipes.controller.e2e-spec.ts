import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppModule } from '../../../app.module';

describe('Recipe Controller - Find All Recipes', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;
  let prismaService: PrismaService;
  let testUser: User;
  let unverifiedTestUser: User;
  let verifiedUserAccessToken: string;
  let unverifiedUserAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
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

  it('should find all recipes which names match query', async () => {
    await userService.updateVerificationStatus(testUser.id);
    return request(app.getHttpServer())
      .get('/recipe?name=test')
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .get('/recipe?name=test')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw an error on unverified user', async () => {
    return request(app.getHttpServer())
      .get('/recipe?name=test')
      .set('Authorization', `bearer ${unverifiedUserAccessToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
