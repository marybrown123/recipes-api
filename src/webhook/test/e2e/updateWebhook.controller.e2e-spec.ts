import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../user/user.service';
import { UpdateWebhookDTO } from '../../DTOs/update-webhook.dto';
import * as request from 'supertest';
import { WebhookService } from '../../webhook.service';
import { WebhookServiceMock } from '../mock/webhook.service.mock';

describe('Webhook Controller - Update', () => {
  let app: INestApplication;
  let testUser: User;
  let testAdmin: User;
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let testAdminAuthenticationToken: string;
  let testUserAuthenticationToken: string;
  const correctPayload: UpdateWebhookDTO = {
    url: 'testUrl',
    isEnabled: false,
    retriesAmount: 5,
  };
  const validationTestStructure = [
    {
      property: 'url',
      value: 1,
    },
    {
      property: 'isEnabled',
      value: 1,
    },
    {
      property: 'retriesAmount',
      value: 'test',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WebhookService)
      .useClass(WebhookServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

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

  it('should update a webhook', async () => {
    return request(app.getHttpServer())
      .patch('/webhook/1')
      .send(correctPayload)
      .set('Authorization', `bearer ${testAdminAuthenticationToken}`)
      .expect(HttpStatus.OK);
  });

  it('should throw an error when user is not admin', async () => {
    return request(app.getHttpServer())
      .patch('/webhook/1')
      .send(correctPayload)
      .set('Authorization', `bearer ${testUserAuthenticationToken}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  validationTestStructure.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      return request(app.getHttpServer())
        .patch('/webhook/1')
        .send(uncorrectPayload)
        .set('Authorization', `bearer ${testAdminAuthenticationToken}`)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
