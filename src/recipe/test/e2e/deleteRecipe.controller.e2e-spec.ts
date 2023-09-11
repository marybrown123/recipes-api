import { CanActivate, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { RecipeService } from '../../recipe.service';
import { RecipeServiceMock } from '../mocks/recipe.service.mock';
import { IsUserAuthorGuard } from '../../../user/guards/is-user-author.guard';
import { Role, User } from '@prisma/client';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as request from 'supertest';

describe('Recipe Controller - Delete', () => {
  let app: INestApplication;
  let testUser: User;
  let unverifiedTestUser: User;
  let userService: UserService;
  let jwtService: JwtService;
  let verifiedUserAccessToken: string;
  let unverifiedUserAccessToken: string;
  let prismaService: PrismaService;
  const fakeGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .overrideGuard(IsUserAuthorGuard)
      .useValue(fakeGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userService = moduleFixture.get<UserService>(UserService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
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

  it('should delete a recipe', async () => {
    return request(app.getHttpServer())
      .delete('/recipe/1')
      .set('Authorization', `bearer ${verifiedUserAccessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw an error on unauthorized user', async () => {
    return request(app.getHttpServer())
      .delete('/recipe/1')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should throw an error on unverified user', async () => {
    return request(app.getHttpServer())
      .delete('/recipe/1')
      .set('Authorization', `bearer ${unverifiedUserAccessToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
