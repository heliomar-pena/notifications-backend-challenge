import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { DetailedEmailNotificationDTO } from '../dto/detailed-email-notification.dto';
import { smsNotificationResponseExample } from './examples/sms-notification.example';
import { emailNotificationResponseExample } from './examples/email-notification.example';
import { Notification } from '../entities/notification.entity';

export const ApiGetDetailedNotificationSwagger = () => {
  return applyDecorators(
    ApiResponse({
      content: {
        'application/json': {
          schema: {
            oneOf: [
              { $ref: getSchemaPath(DetailedEmailNotificationDTO) },
              { $ref: getSchemaPath(Notification) },
            ],
          },
          examples: {
            smsOrPush: {
              summary: 'SMS or PUSH',
              value: smsNotificationResponseExample,
            },
            email: {
              summary: 'EMAIL',
              value: emailNotificationResponseExample,
            },
          },
        },
      },
    }),
  );
};
