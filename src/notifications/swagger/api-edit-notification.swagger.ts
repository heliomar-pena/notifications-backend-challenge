import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { UpdateNotificationDTO } from '../dto/update-notification.dto';
import { UpdateEmailNotificationDTO } from 'src/email-notifications/dto/update-email-notification.dto';
import { emailNotificationEditRequestExample } from './examples/email-notification.example';
import { smsNotificationEditRequestExample } from './examples/sms-notification.example';

export const ApiEditNotificationSwagger = () => {
  return applyDecorators(
    ApiExtraModels(UpdateNotificationDTO, UpdateEmailNotificationDTO),
    ApiBody({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(UpdateNotificationDTO) },
          { $ref: getSchemaPath(UpdateEmailNotificationDTO) },
        ],
      },
      examples: {
        email: {
          summary: 'EMAIL',
          value: emailNotificationEditRequestExample,
        },
        sms: {
          summary: 'SMS or PUSH',
          value: smsNotificationEditRequestExample,
        },
      },
    }),
  );
};
