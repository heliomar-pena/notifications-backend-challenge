import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  authenticateHelper,
  AuthorizationHeader,
} from './helper/authenticate.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

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

  describe('/users/me (GET)', () => {
    describe('When user is not logged in', () => {
      it('Then should return 401 UNAUTHORIZED', () => {
        return request(app.getHttpServer()).get('/users/me').expect(401);
      });
    });

    describe('When user is logged in', () => {
      let email: string;
      let password: string;
      let header: AuthorizationHeader;

      beforeEach(async () => {
        email = 'first_user@email.test.com';
        password = '1234';

        header = await authenticateHelper(app)
          .signUp({
            email,
            password,
          })
          .then((res) => res.header);
      });

      it('Then should return the current user data', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/me')
          .set(header)
          .expect(200);

        expect(response.body).toEqual(
          expect.objectContaining({
            email,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(String),
          }),
        );
      });
    });
  });
});
