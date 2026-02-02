import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let email: string;
  let password: string;

  beforeEach(() => {
    email = 'default_test_email@test.com';
    password = 'default_test_password';
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/sign-up (POST)', () => {
    describe('When email is already used', () => {
      beforeEach(() => {
        email = 'john.doe@acme.com'; // The default user created in seeds;
      });

      it('Then it should return 409 Conflict', () => {
        return request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({
            email,
            password,
          })
          .expect(409);
      });
    });

    describe('When user is new and credentials are valid', () => {
      let accessToken: string;
      beforeEach(async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send({
            email,
            password,
          })
          .expect(201);

        accessToken = (response.body as { access_token: string }).access_token;
      });

      it('Then it should return 201 and the user access token', () => {
        expect(accessToken).toEqual(expect.any(String));
      });

      describe('And user attempts to log in', () => {
        it('Then should return 200 and user access token', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              email,
              password,
            })
            .expect(201);

          expect(response.body).toEqual(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            expect.objectContaining({ access_token: expect.any(String) }),
          );
        });
      });
    });
  });

  describe('/auth/login (POST)', () => {
    describe('When credentials are invalid', () => {
      it('Then it should return 401 UNAUTHORIZED', async () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email,
            password,
          })
          .expect(401);
      });
    });
  });
});
