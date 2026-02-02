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
import emailConfig from 'src/clients/email.config';
import { CreateTemplateDto } from 'src/email-templates/dto/create-template.dto';

const mockedEmailTemplateId = '30309395-68cc-4cbd-8c28-39aa59d177e8';
const mockedEmailTemplateDetails = {
  name: 'My first template',
  html: '<div>This gives style to my email, {{{A_VARIABLE_HERE}}}</div>',
  variables: [
    {
      key: 'A_VARIABLE_HERE',
      type: 'string',
      fallback_value: 'default value in case variable is not provided',
    },
  ],
};

describe('Email Templates', () => {
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

  describe('/email-templates (POST): When a email template is created', () => {
    let emailTemplate: { id: string };

    beforeEach(async () => {
      mock
        .onPost(`${emailConfig().url}/templates`)
        .reply(200, { id: mockedEmailTemplateId });

      const result = await request(app.getHttpServer())
        .post('/email-templates')
        .set(authHeader)
        .send(mockedEmailTemplateDetails)
        .expect(201);

      emailTemplate = result.body as { id: string };
    });

    it('Then it should return the email template id', () => {
      expect(emailTemplate.id).toEqual(expect.any(String));
    });

    describe('/email-templates (GET): When email templates are retrieved', () => {
      let emailTemplates: CreateTemplateDto[];
      beforeEach(async () => {
        mock
          .onGet(`${emailConfig().url}/templates/${mockedEmailTemplateId}`)
          .reply(200, {
            ...mockedEmailTemplateDetails,
            id: mockedEmailTemplateId,
            status: 'draft',
          });
        const result = await request(app.getHttpServer())
          .get('/email-templates')
          .set(authHeader)
          .send()
          .expect(200);

        emailTemplates = result.body as CreateTemplateDto[];
      });

      it('Then it should retrieve details from the provider and show it with our DB ID', () => {
        expect(emailTemplates).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...mockedEmailTemplateDetails,
              id: emailTemplate.id,
              status: 'draft',
            }),
          ]),
        );
      });
    });

    describe('/email-templates/{id} (PATCH): When email templates are edited', () => {
      it('Then it should return the email template id', async () => {
        mock
          .onPatch(`${emailConfig().url}/templates/${mockedEmailTemplateId}`)
          .reply(200, { id: mockedEmailTemplateId });

        await request(app.getHttpServer())
          .patch(`/email-templates/${emailTemplate.id}`)
          .set(authHeader)
          .send(mockedEmailTemplateDetails)
          .expect(200);
      });
    });

    describe('/email-templates/{id} (DELETE): When email templates are deleted', () => {
      beforeEach(async () => {
        mock
          .onDelete(`${emailConfig().url}/templates/${mockedEmailTemplateId}`)
          .reply(200, { message: 'Deleted successfully' });
        await request(app.getHttpServer())
          .delete(`/email-templates/${emailTemplate.id}`)
          .set(authHeader)
          .send()
          .expect(200);
      });

      it('Then it should not appear in GET request anymore', async () => {
        const result = await request(app.getHttpServer())
          .get('/email-templates')
          .set(authHeader)
          .send()
          .expect(200);

        expect(result.body).toStrictEqual([]);
      });
    });

    describe('/email-templates/publish/{id} (POST): When email template is published', () => {
      it('Then should ask provider to publish it', async () => {
        mock
          .onPost(
            `${emailConfig().url}/templates/${mockedEmailTemplateId}/publish`,
          )
          .reply(200, {
            message: 'Template published successfully',
          });
        await request(app.getHttpServer())
          .post(`/email-templates/publish/${emailTemplate.id}`)
          .set(authHeader)
          .send()
          .expect(201);
      });
    });
  });
});
