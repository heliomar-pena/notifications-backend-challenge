import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationFactory } from './strategies/notification-factory.service';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { UpdateEmailNotificationDTO } from 'src/email-notifications/dto/update-email-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  createNotification(
    userId: User['id'],
    createNotificationDto:
      | (Omit<CreateNotificationDto, 'channel'> & { channel: 'sms' | 'push' })
      | CreateEmailNotificationDto,
  ) {
    const strategy = this.notificationFactory.getStrategy(
      createNotificationDto.channel,
    );

    return strategy.create(userId, createNotificationDto);
  }

  async editNotification(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: Omit<
      UpdateEmailNotificationDTO | UpdateNotificationDTO,
      'channel'
    >,
  ) {
    const notification = await this.notificationsRepository.userNotification(
      userId,
      notificationId,
    );

    if (!notification) throw new NotFoundException();

    const strategy = this.notificationFactory.getStrategy(notification.channel);

    return strategy.edit(userId, notificationId, updateNotificationDto);
  }

  deleteNotification(userId: User['id'], notificationId: Notification['id']) {
    return this.notificationsRepository.delete(userId, notificationId);
  }

  async getDetailedNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    const notification = await this.notificationsRepository.userNotification(
      userId,
      notificationId,
    );

    if (!notification) throw new NotFoundException();

    const strategy = this.notificationFactory.getStrategy(notification.channel);

    return await strategy.getDetailedNotification(userId, notification);
  }

  myNotifications(userId: User['id']) {
    return this.notificationsRepository.userNotifications(userId);
  }
}
