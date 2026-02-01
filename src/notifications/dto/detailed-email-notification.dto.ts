import { EmailNotifications } from 'src/email-notifications/entities/email-notifications.entity';
import { Notification } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';

export class DetailedEmailNotificationDTO extends Notification {
  @ApiProperty({
    example: {
      MY_VARIABLE: 'Value for that variable!',
    },
    description:
      'The variables that will contain custom values for your templates. If not provided, the fallback defaults provided when created the templates will be used.',
  })
  variables: EmailNotifications['variables'];
  @ApiProperty({
    type: EmailTemplates,
    example: {
      id: '123',
      template_id: '123',
    },
    description:
      'Information about the template for the current email notification.',
  })
  template: EmailNotifications['template'];
}
