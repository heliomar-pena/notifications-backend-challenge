import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  authenticateHelper,
  AuthorizationHeader,
} from './helper/authenticate.helper';
import { HttpService } from '@nestjs/axios';
import {
  smsNotificationCreateRequestExample,
  smsNotificationEditRequestExample,
} from 'src/notifications/swagger/examples/sms-notification.example';
import MockAdapter from 'axios-mock-adapter';
import notificationsProviderConfig from 'src/clients/notifications-provider.config';

describe('NotificationController Channel SMS', () => {
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

    describe('And destinations are not phone numbers', () => {
      it('Then should return error BAD_REQUEST', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send({
            ...smsNotificationCreateRequestExample,
            destinations: ['incorrect_email@test.com'],
          })
          .expect(400);
      });
    });

    describe('And content have more than 160 characters', () => {
      it('Then should return error 400 BAD_REQUEST', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send({
            ...smsNotificationCreateRequestExample,
            content: 'a'.repeat(170),
            destinations: ['incorrect_email@test.com'],
          })
          .expect(400);
      });
    });

    describe('And values are correct', () => {
      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send(smsNotificationCreateRequestExample)
          .expect(201);

        notification = result.body as { id: string };
      });

      describe('/notifications (PUT): And user tries to update it', () => {
        describe('And destinations are not phone numbers', () => {
          it('Then should return error BAD_REQUEST', async () => {
            await request(app.getHttpServer())
              .patch(`/notifications/${notification.id}`)
              .set(authHeader)
              .send({
                ...smsNotificationEditRequestExample,
                destinations: ['incorrect_email@test.com'],
              })
              .expect(400);
          });
        });

        describe('And content have more than 160 characters', () => {
          it('Then should return error 400 BAD_REQUEST', async () => {
            await request(app.getHttpServer())
              .patch(`/notifications/${notification.id}`)
              .set(authHeader)
              .send({
                ...smsNotificationEditRequestExample,
                content: 'a'.repeat(170),
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
              .send(smsNotificationEditRequestExample)
              .expect(200);
          });
        });
      });

      describe('/notifications/send-notification/{id} (POST): And user send the notification', () => {
        beforeEach(async () => {
          mock
            .onPost(`${notificationsProviderConfig().url}/sms`)
            .reply(201, { id: '6cf6040f-884d-45cc-9d3f-287886582e95' });
          await request(app.getHttpServer())
            .post(`/notifications/send-notification/${notification.id}`)
            .set(authHeader)
            .expect(201);
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
