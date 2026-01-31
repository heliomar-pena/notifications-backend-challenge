import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationFactory } from './strategies/notification-factory.service';
import {
  NotificationStatus,
  NotificationStatusType,
} from 'src/enums/notification-status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  async #getNotificationOrThrow(
    userId: string,
    notificationId: string,
  ): Promise<Notification> {
    const notification = await this.notificationsRepository.userNotification(
      userId,
      notificationId,
    );

    if (!notification) throw new NotFoundException();

    return notification;
  }

  async #getNotificationAndValidateStatus(
    userId: string,
    notificationId: string,
    invalidStatus: NotificationStatusType[] = [NotificationStatus.SENT],
  ): Promise<Notification> {
    const notification = await this.#getNotificationOrThrow(
      userId,
      notificationId,
    );

    if (invalidStatus.includes(notification.status))
      throw new ConflictException(
        `Invalid notifications status: ${notification.status}`,
      );

    return notification;
  }

  createNotification(
    userId: User['id'],
    createNotificationDto: CreateNotificationDto,
  ) {
    const strategy = this.notificationFactory.getStrategy(
      createNotificationDto.channel,
    );

    return strategy.create(userId, createNotificationDto);
  }

  async editNotification(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDTO,
  ) {
    const notification = await this.#getNotificationAndValidateStatus(
      userId,
      notificationId,
    );

    const strategy = this.notificationFactory.getStrategy(notification.channel);

    return strategy.edit(userId, notificationId, updateNotificationDto);
  }

  async deleteNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    const notification = await this.#getNotificationAndValidateStatus(
      userId,
      notificationId,
    );

    const strategy = this.notificationFactory.getStrategy(notification.channel);

    return strategy.delete(userId, notification.id);
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

  async sendNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    const notification = await this.#getNotificationAndValidateStatus(
      userId,
      notificationId,
    );

    const strategy = this.notificationFactory.getStrategy(notification.channel);

    const { referenceId } = await strategy.send(userId, notification);

    await this.notificationsRepository.updateNotification(
      userId,
      notification.id,
      {
        status: NotificationStatus.SENT,
        reference_id: referenceId,
      },
    );
  }
}
