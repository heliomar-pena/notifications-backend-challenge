import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  createNotification(
    userId: User['id'],
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsRepository.create(userId, createNotificationDto);
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
