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
import {
  emailNotificationCreateRequestExample,
  emailNotificationEditRequestExample,
} from 'src/notifications/swagger/examples/email-notification.example';
import emailConfig from 'src/clients/email.config';

describe('NotificationController Channel Email', () => {
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

    describe('And destinations are not emails', () => {
      it('Then should return error BAD_REQUEST, destination must be an email', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send({
            ...emailNotificationCreateRequestExample,
            destinations: ['John Doe', '+54281232323'],
          })
          .expect(400)
          .expect({
            error: 'Bad Request',
            message: ['each value in destinations must be an email'],
            status: 400,
          });
      });
    });

    describe('And template is not UUID', () => {
      it('Then should return error BAD_REQUEST, template must be an uuid', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send({
            ...emailNotificationCreateRequestExample,
            template_id: '123',
          })
          .expect(400)
          .expect({
            error: 'Bad Request',
            message: ['template_id must be a UUID'],
            status: 400,
          });
      });
    });

    describe('And template does not exists', () => {
      it('Then should return error NOT FOUND, template does not exists', async () => {
        await request(app.getHttpServer())
          .post('/notifications')
          .set(authHeader)
          .send(emailNotificationCreateRequestExample)
          .expect(404)
          .expect({
            message: `Template with ID ${emailNotificationCreateRequestExample.template_id} was not found`,
            error: 'Not Found',
            statusCode: 404,
          });
      });
    });

    describe('When a template is created', () => {
      let template: { id: string };
      beforeEach(async () => {
        mock.onPost(`${emailConfig().url}/templates`).reply(200, {
          id: '39183dc0-b867-44c9-8ca5-95b404769327',
        });
        const result = await request(app.getHttpServer())
          .post('/email-templates')
          .set(authHeader)
          .send({
            name: 'My first template',
            html: '<div>This gives style to my email, {{{A_VARIABLE_HERE}}}</div>',
            variables: [
              {
                key: 'A_VARIABLE_HERE',
                type: 'string',
                fallback_value:
                  'default value in case variable is not provided',
              },
            ],
          })
          .expect(201);

        template = result.body as { id: string };
      });

      describe('And user creates a notification with the recently created template', () => {
        beforeEach(async () => {
          const result = await request(app.getHttpServer())
            .post('/notifications')
            .set(authHeader)
            .send({
              ...emailNotificationCreateRequestExample,
              template_id: template.id,
            })
            .expect(201);

          notification = result.body as { id: string };
        });

        describe('/notifications/{id} (PUT): And user tries to update it', () => {
          describe('And destinations are not emails', () => {
            it('Then should return error BAD_REQUEST, destination must be an email', async () => {
              await request(app.getHttpServer())
                .patch(`/notifications/${notification.id}`)
                .set(authHeader)
                .send({
                  ...emailNotificationCreateRequestExample,
                  destinations: ['John Doe', '+54281232323'],
                })
                .expect(400)
                .expect({
                  error: 'Bad Request',
                  message: ['each value in destinations must be an email'],
                  status: 400,
                });
            });
          });

          describe('And template is not UUID', () => {
            it('Then should return error BAD_REQUEST, template must be an uuid', async () => {
              await request(app.getHttpServer())
                .patch(`/notifications/${notification.id}`)
                .set(authHeader)
                .send({
                  ...emailNotificationCreateRequestExample,
                  template_id: '123',
                })
                .expect(400)
                .expect({
                  error: 'Bad Request',
                  message: ['template_id must be a UUID'],
                  status: 400,
                });
            });
          });

          describe('And template does not exists', () => {
            it('Then should return error NOT FOUND, template does not exists', async () => {
              await request(app.getHttpServer())
                .patch(`/notifications/${notification.id}`)
                .set(authHeader)
                .send(emailNotificationCreateRequestExample)
                .expect(404)
                .expect({
                  message: `Template with ID ${emailNotificationCreateRequestExample.template_id} was not found`,
                  error: 'Not Found',
                  statusCode: 404,
                });
            });
          });

          describe('And content is correct', () => {
            it('Then should return 200', async () => {
              await request(app.getHttpServer())
                .patch(`/notifications/${notification.id}`)
                .set(authHeader)
                .send({
                  ...emailNotificationEditRequestExample,
                  template_id: template.id,
                })
                .expect(200);
            });
          });
        });

        describe('/notification/{id} (GET): And user request the detailed notification', () => {
          it('Then should return notification + template id + variables', async () => {
            const result = await request(app.getHttpServer())
              .get(`/notifications/${notification.id}`)
              .set(authHeader)
              .send()
              .expect(200);

            expect(result.body).toEqual({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(String),
              title: 'My great notification',
              content: 'Hello world!',
              channel: 'email',
              reference_id: null,
              status: 'created',
              destinations: ['john.doe@local.com'],
              deleted_at: null,
              variables: { MY_VARIABLE: 'Value for that variable!' },
              template: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                id: expect.any(String),
                template_id: '39183dc0-b867-44c9-8ca5-95b404769327',
                deleted_at: null,
              },
            });
          });
        });

        describe('/notifications/send-notification/{id} (POST): And user send the notification', () => {
          beforeEach(async () => {
            mock
              .onPost(`${emailConfig().url}/emails`)
              .reply(200, { id: '406d354b-9b24-44b4-914f-8e05ec4d0850' });
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
});
