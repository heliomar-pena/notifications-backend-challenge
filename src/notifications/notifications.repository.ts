import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateNotificationDTO } from './dto/update-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification['id'] | undefined> {
    const result = await this.notificationsRepository.insert({
      user: { id: userId },
      ...createNotificationDto,
    });

    return result.identifiers[0].id as Notification['id'];
  }

  edit(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDTO,
  ) {
    return this.notificationsRepository.update(
      { user: { id: userId }, id: notificationId },
      updateNotificationDto,
    );
  }

  delete(userId: User['id'], notificationId: Notification['id']) {
    return this.notificationsRepository.softDelete({
      user: { id: userId },
      id: notificationId,
    });
  }

  userNotifications(userId: User['id']) {
    return this.notificationsRepository.findBy({ user: { id: userId } });
  }

  userNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ): Promise<Notification | null> {
    return this.notificationsRepository.findOne({
      where: { user: { id: userId }, id: notificationId },
    });
  }
}
