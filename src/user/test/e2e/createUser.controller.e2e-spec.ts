import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../../../user/DTOs/create-user.DTO';
import { UserServiceMock } from '../../../user/test/mocks/user.service.mock';
import { UserService } from '../../../user/user.service';
import * as request from 'supertest';
import { UserModule } from '../../../user/user.module';

describe('User Controller - Create', () => {
  let app: INestApplication;
  const path = '/user/signup';

  const correctPayload: CreateUserDTO = {
    name: 'testName',
    password: 'testPassword',
  };

  const validationTestStructrue = [
    {
      property: 'name',
      value: 1,
      description: 'is number',
    },
    {
      property: 'password',
      value: 1,
      description: 'is number',
    },
    {
      property: 'password',
      value: 'short',
      description: 'is shorter than 8 characters',
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useClass(UserServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('should create a user', async () => {
    return request(app.getHttpServer())
      .post(path)
      .send(correctPayload)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        console.log(res.body);
        expect(res.body.name).toBe(correctPayload.name);
        expect(res.body.password).not.toBeDefined();
      });
  });

  validationTestStructrue.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when ${object.property} ${object.description}`, async () => {
      return request(app.getHttpServer())
        .post(path)
        .send(uncorrectPayload)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
