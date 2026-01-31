import { Injectable } from '@nestjs/common';
import { EmailStrategy } from './email.strategy';
import { ChannelValuesType } from 'src/enums/channel.enum';

@Injectable()
export class NotificationFactory {
  constructor(private readonly emailStrategy: EmailStrategy) {}

  getStrategy(channel: ChannelValuesType) {
    switch (channel) {
      case 'email':
        return this.emailStrategy;
      case 'push':
      case 'sms':
      default:
        throw new Error(`Unsupported notification channel: ${channel}`);
    }
  }
}
