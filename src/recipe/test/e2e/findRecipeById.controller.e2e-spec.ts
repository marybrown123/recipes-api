import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../../../auth/auth.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecipeModule } from '../../../recipe/recipe.module';
import { RecipeService } from '../../../recipe/recipe.service';
import { RecipeServiceMock } from '../../../recipe/test/mocks/recipe.service.mock';

describe('Recipe Controller - Find By Id', () => {
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

  it('should find one recipe by id', async () => {
    return request(app.getHttpServer())
      .get('/recipe/1')
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error when recipe is not found', async () => {
    return request(app.getHttpServer())
      .get('/recipe/2')
      .set('Authorization', `bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should throw error on unathourized user', async () => {
    return request(app.getHttpServer())
      .get('/recipe/1')
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
