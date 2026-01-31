import { Injectable } from '@nestjs/common';
import { EmailStrategy } from './email.strategy';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';

@Injectable()
export class NotificationFactory {
  constructor(private readonly emailStrategy: EmailStrategy) {}

  getStrategy(
    dto:
      | CreateEmailNotificationDto
      | (Omit<CreateNotificationDto, 'channel'> & { channel: 'sms' | 'push' }),
  ) {
    switch (dto.channel) {
      case 'email':
        return { strategy: this.emailStrategy, typedDto: dto };
      case 'push':
      case 'sms':
      default:
        throw new Error(`Unsupported notification channel: ${dto.channel}`);
    }
  }
}
