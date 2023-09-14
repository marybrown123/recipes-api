import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../user/user.service';
import { Role, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { WebhookService } from '../../webhook.service';
import { WebhookServiceMock } from '../mock/webhook.service.mock';
import * as request from 'supertest';

describe('Webhook Controller - Fetch All Webhooks', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userService: UserService;
  let prismaService: PrismaService;
  let testAdmin: User;
  let testUser: User;
  let testAdminAuthenticationToken: string;
  let testUserAuthenticationToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WebhookService)
      .useClass(WebhookServiceMock)
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

    testAdmin = await userService.generateAccount(
      process.env.TEST_ADMIN_EMAIL,
      process.env.TEST_ADMIN_NAME,
      process.env.TEST_ADMIN_PASSWORD,
      Role.ADMIN,
    );

    await userService.updateVerificationStatus(testUser.id);
    await userService.updateVerificationStatus(testAdmin.id);

    testAdminAuthenticationToken = jwtService.sign({
      name: testAdmin.name,
      sub: testAdmin.id,
    });

    testUserAuthenticationToken = jwtService.sign({
      name: testUser.name,
      sub: testUser.id,
    });
  });

  afterAll(async () => {
    await prismaService.user.delete({ where: { id: testUser.id } });
    await app.close();
  });

  it('should fetch all webhooks', async () => {
    return await request(app.getHttpServer())
      .get('/webhook')
      .set('Authorization', `bearer ${testAdminAuthenticationToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw error when user is not admin', async () => {
    return await request(app.getHttpServer())
      .get('/webhook')
      .set('Authorization', `bearer ${testUserAuthenticationToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });
});
