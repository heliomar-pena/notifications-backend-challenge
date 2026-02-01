import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { UpdateNotificationDTO } from '../dto/update-notification.dto';
import { Notification } from '../entities/notification.entity';

export interface NotificationStrategy<
  DetailedNotification extends Partial<Notification>,
> {
  create(
    userId: User['id'],
    createNotificationDto: CreateNotificationDTO,
  ): Promise<{ id: Notification['id'] }>;

  edit(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDTO,
  ): Promise<{ id: Notification['id'] }>;

  delete(userId: User['id'], notificationId: Notification['id']): Promise<void>;

  getDetailedNotification(
    userId: User['id'],
    notification: Notification,
  ): Promise<DetailedNotification>;

  send(
    userId: User['id'],
    notification: Notification,
  ): Promise<{ referenceId: string }>;
}
