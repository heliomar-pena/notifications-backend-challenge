import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import notificationsProviderConfig from './notifications-provider.config';
import { Notification } from 'src/notifications/entities/notification.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationsProviderClient {
  constructor(
    private readonly httpService: HttpService,
    @Inject(notificationsProviderConfig.KEY)
    private notificationsEnv: ConfigType<typeof notificationsProviderConfig>,
  ) {}

  async sendSMS(notification: Notification) {
    const result = await firstValueFrom(
      this.httpService.post<{ id: string }>(
        `${this.notificationsEnv.url}/sms`,
        {
          destinations: notification.destinations,
          title: notification.title,
          content: notification.content,
        },
      ),
    );

    return result.data.id;
  }

  async sendPushNotification(notification: Notification) {
    const result = await firstValueFrom(
      this.httpService.post<{ id: string }>(
        `${this.notificationsEnv.url}/push`,
        {
          destinations: notification.destinations,
          title: notification.title,
          content: notification.content,
        },
      ),
    );

    return result.data.id;
  }
}
