import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  authenticateHelper,
  AuthorizationHeader,
} from './helper/authenticate.helper';
import {
  smsNotificationCreateRequestExample,
  smsNotificationEditRequestExample,
} from 'src/notifications/swagger/examples/sms-notification.example';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationStatus } from 'src/notifications/enums/notification-status.enum';

/**
 * Couple of tests that covers general use of Notifications channel.
 * The scenarious on these tests are possible in the three tests channels.
 * Each channel have its own test file for specific tests.
 */
describe('NotificationController General Test (e2e) test', () => {
  let app: INestApplication<App>;
  let authHeader: AuthorizationHeader;

  beforeEach(async () => {
    authHeader = await authenticateHelper(app)
      .signUp()
      .then((res) => res.header);
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

  describe('/notifications (POST): When a notification is created', () => {
    let notification: { id: string };

    beforeEach(async () => {
      const result = await request(app.getHttpServer())
        .post('/notifications')
        .set(authHeader)
        .send(smsNotificationCreateRequestExample)
        .expect(201);

      notification = result.body as { id: string };
    });

    it('Then should return the notification ID', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect(notification).toEqual({ id: expect.any(String) });
    });

    describe('/notifications (GET): And user check notifications created', () => {
      let userNotifications: Notification[];

      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .get('/notifications')
          .set(authHeader)
          .send()
          .expect(200);

        userNotifications = result.body as Notification[];
      });

      it('Then should contain the recently created notification', () => {
        expect(userNotifications).toHaveLength(1);
        expect(userNotifications[0]).toEqual({
          id: notification.id,
          deleted_at: null,
          status: NotificationStatus.CREATED,
          reference_id: null,
          ...smsNotificationCreateRequestExample,
        });
      });
    });

    describe('/notifications/{id} (GET): And user request notification by ID', () => {
      let notificationDetail: Notification;

      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .get(`/notifications/${notification.id}`)
          .set(authHeader)
          .send()
          .expect(200);

        notificationDetail = result.body as Notification;
      });

      it('Then should return the notification', () => {
        expect(notificationDetail).toEqual({
          id: notification.id,
          deleted_at: null,
          status: NotificationStatus.CREATED,
          reference_id: null,
          ...smsNotificationCreateRequestExample,
        });
      });
    });

    describe('/notifications/{id} (PUT): And user edits a notification', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .put(`/notifications/${notification.id}`)
          .set(authHeader)
          .send(smsNotificationEditRequestExample)
          .expect(200);
      });

      it("Then notification must have changed the next time it's called", async () => {
        const result = await request(app.getHttpServer())
          .get(`/notifications/${notification.id}`)
          .set(authHeader)
          .send()
          .expect(200);

        const resultBody = result.body as Notification;

        expect(resultBody).toEqual({
          id: notification.id,
          channel: 'sms',
          deleted_at: null,
          status: NotificationStatus.CREATED,
          reference_id: null,
          ...smsNotificationEditRequestExample,
        });
      });
    });

    describe('/notifications/{id} (DELETE): And user deletes the notification', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .delete(`/notifications/${notification.id}`)
          .set(authHeader)
          .send()
          .expect(200);
      });

      it("Then notification must return 404 the next time it's requested", async () => {
        await request(app.getHttpServer())
          .get(`/notifications/${notification.id}`)
          .set(authHeader)
          .send()
          .expect(404);
      });
    });
  });
});
