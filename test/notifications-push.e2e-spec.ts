import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  authenticateHelper,
  AuthorizationHeader,
} from './helper/authenticate.helper';
import { HttpService } from '@nestjs/axios';
import MockAdapter from 'axios-mock-adapter';
import notificationsProviderConfig from 'src/clients/notifications-provider.config';
import {
  pushNotificationCreateRequestExample,
  pushNotificationEditRequestExample,
} from 'src/notifications/swagger/examples/push-notification.example';

describe('NotificationController Channel PUSH', () => {
  let app: INestApplication<App>;
  let authHeader: AuthorizationHeader;
  let mock: MockAdapter;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    authHeader = await authenticateHelper(app)
      .signUp()
      .then((res) => res.header);
    const httpService = app.get<HttpService>(HttpService);
    mock = new MockAdapter(httpService.axiosRef);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/notifications (POST): When a notification is created', () => {
    let notification: { id: string };

    describe('And destinations are not FCM tokens', () => {
      it('Then should return error BAD_REQUEST', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send({
            ...pushNotificationCreateRequestExample,
            destinations: ['incorrect_email@test.com'],
          })
          .expect(400)
          .expect({
            error: 'Bad Request',
            message: ['Token length is invalid'],
            status: 400,
          });
      });
    });

    describe('And values are correct', () => {
      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send(pushNotificationCreateRequestExample)
          .expect(201);

        notification = result.body as { id: string };
      });

      describe('/notifications (PUT): And user tries to update it', () => {
        describe('And destinations are not FCM Tokens', () => {
          it('Then should return error BAD_REQUEST', async () => {
            await request(app.getHttpServer())
              .patch(`/notifications/${notification.id}`)
              .set(authHeader)
              .send({
                ...pushNotificationEditRequestExample,
                destinations: ['incorrect_email@test.com'],
              })
              .expect(400);
          });
        });

        describe('And content is correct', () => {
          it('Then should return 200', async () => {
            await request(app.getHttpServer())
              .patch(`/notifications/${notification.id}`)
              .set(authHeader)
              .send(pushNotificationEditRequestExample)
              .expect(200);
          });
        });
      });

      describe('/notifications/send-notification/{id} (POST): And user send the notification', () => {
        beforeEach(async () => {
          mock
            .onPost(`${notificationsProviderConfig().url}/push`)
            .reply(201, { id: '6cf6040f-884d-45cc-9d3f-287886582e95' });
          await request(app.getHttpServer())
            .post(`/notifications/send-notification/${notification.id}`)
            .set(authHeader)
            .expect(201);
        });

        it('Then status must be mark as Sent in the Notification', async () => {
          const result = await request(app.getHttpServer())
            .get(`/notifications/${notification.id}`)
            .set(authHeader)
            .send()
            .expect(200);

          expect(result.body).toEqual(
            expect.objectContaining({
              channel: 'push',
              content: 'Hello world!',
              deleted_at: null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              reference_id: expect.any(String),
              status: 'sent',
              title: 'My great notification',
            }),
          );
        });

        describe('And notification was already sent', () => {
          it('Then should return error 409', async () => {
            await request(app.getHttpServer())
              .post(`/notifications/send-notification/${notification.id}`)
              .set(authHeader)
              .expect(409);
          });
        });
      });
    });
  });
});
