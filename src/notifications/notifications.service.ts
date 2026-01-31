import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationFactory } from './strategies/notification-factory.service';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';

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
    const { strategy, typedDto } = this.notificationFactory.getStrategy(
      createNotificationDto,
    );

    return strategy.create(userId, typedDto);
  }

  editNotification(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDTO,
  ) {
    return this.notificationsRepository.edit(
      userId,
      notificationId,
      updateNotificationDto,
    );
  }

  deleteNotification(userId: User['id'], notificationId: Notification['id']) {
    return this.notificationsRepository.delete(userId, notificationId);
  }

  myNotifications(userId: User['id']) {
    return this.notificationsRepository.userNotifications(userId);
  }
}
