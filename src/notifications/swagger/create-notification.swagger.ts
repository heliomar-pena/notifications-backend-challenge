import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { CreateEmailNotificationDTO } from 'src/email-notifications/dto/create-email-notification.dto';
import { emailNotificationCreateRequestExample } from './examples/email-notification.example';
import { smsNotificationCreateRequestExample } from './examples/sms-notification.example';

export const ApiCreateNotificationSwagger = () => {
  return applyDecorators(
    ApiExtraModels(CreateNotificationDTO, CreateEmailNotificationDTO),
    ApiBody({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(CreateNotificationDTO) },
          { $ref: getSchemaPath(CreateEmailNotificationDTO) },
        ],
      },
      examples: {
        email: {
          summary: 'EMAIL',
          value: emailNotificationCreateRequestExample,
        },
        sms: {
          summary: 'SMS or PUSH',
          value: smsNotificationCreateRequestExample,
        },
      },
    }),
  );
};
