import { EmailNotifications } from 'src/email-notifications/entities/email-notifications.entity';

export class SendEmailBodyDto {
  subject: string;
  from: string;
  to: string[];
  template: {
    id: string;
    variables: EmailNotifications['variables'];
  };
}
