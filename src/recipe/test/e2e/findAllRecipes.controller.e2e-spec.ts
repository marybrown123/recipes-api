import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../../auth/auth.module';
import { RecipeModule } from '../../../recipe/recipe.module';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';
import { UserService } from '../../../user/user.service';
import { Role } from '@prisma/client';

describe('Recipe Controller - Find All Recipes', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RecipeModule, AuthModule],
    })
      .overrideProvider(RecipeService)
      .useClass(RecipeServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    userService = moduleFixture.get<UserService>(UserService);
  });

  beforeEach(async () => {
    const testUser = await userService.generateAccount(
      process.env.TEST_NAME,
      process.env.TEST_PASSWORD,
      Role.USER,
    );
    accessToken = jwtService.sign({
      name: testUser.name,
      sub: testUser.id,
    });
  });

  it('should find all recipes which names match query', async () => {
    return request(app.getHttpServer())
      .get('/recipe?name=test')
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .get('/recipe?name=test')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
