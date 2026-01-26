import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  createNotification(
    userId: User['id'],
    createNotificationDto: CreateNotificationDto,
  ) {
    return 'Notification created!';
  }

  editNotification(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDTO,
  ) {
    return 'Notification modified';
  }

  deleteNotification() {
    return 'Notification deleted';
  }

  myNotifications() {
    return [];
  }
}
