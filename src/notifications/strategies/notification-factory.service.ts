import { Injectable } from '@nestjs/common';
import { EmailStrategy } from './email.strategy';
import { ChannelValuesType } from 'src/notifications/enums/channel.enum';
import { SMSStrategy } from './sms.strategy';
import { PushStrategy } from './push.strategy';

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly emailStrategy: EmailStrategy,
    private readonly smsStrategy: SMSStrategy,
    private readonly pushStrategy: PushStrategy,
  ) {}

  getStrategy(channel: ChannelValuesType) {
    switch (channel) {
      case 'email':
        return this.emailStrategy;
      case 'sms':
        return this.smsStrategy;
      case 'push':
        return this.pushStrategy;
      default:
        throw new Error('Unsupported notification channel');
    }
  }
}
