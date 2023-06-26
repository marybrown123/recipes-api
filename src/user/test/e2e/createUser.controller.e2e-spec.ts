import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../../../user/DTOs/create-user.DTO';
import { UserServiceMock } from '../../../user/test/mocks/user.service.mock';
import { UserService } from '../../../user/user.service';
import * as request from 'supertest';
import { UserModule } from '../../../user/user.module';

describe('User Controller - Create', () => {
  let app: INestApplication;

  const correctPayload: CreateUserDTO = {
    name: 'testName',
    password: 'testPassword',
  };

  const validationTestStructrue = [
    {
      property: 'name',
      value: 1,
    },
    {
      property: 'password',
      value: 1,
    },
    {
      property: 'password',
      value: 'short',
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
      .post('/user/signup')
      .send(correctPayload)
      .expect(HttpStatus.CREATED);
  });

  validationTestStructrue.map((object) => {
    const uncorrectPayload = { ...correctPayload };
    uncorrectPayload[object.property] = object.value;
    return it(`should throw validation error when property ${object.property} is ${object.value}`, async () => {
      return request(app.getHttpServer())
        .post('/user/signup')
        .send(uncorrectPayload)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });
  });
});
