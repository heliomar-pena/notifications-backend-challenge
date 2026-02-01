import { NotificationStrategy } from './notification-strategy.interface';
import { Notification } from '../entities/notification.entity';
import { NotificationsRepository } from '../notifications.repository';
import { validateClass } from 'src/utils/validate-class';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { UpdateNotificationDTO } from '../dto/update-notification.dto';
import { User } from 'src/users/entities/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export abstract class BaseNotificationStrategy<
  UpdateNotificationDtoT extends UpdateNotificationDTO,
  CreateNotificationDtoT extends CreateNotificationDTO,
  DetailedNotification extends Notification,
> implements NotificationStrategy<DetailedNotification> {
  constructor(
    private readonly baseNotificationsRepository: NotificationsRepository,
  ) {}

  async create(
    userId: User['id'],
    createNotificationDto: CreateNotificationDtoT,
  ): Promise<{ id: Notification['id'] }> {
    const validatedNotificationDto = await this.validateCreateDto(
      createNotificationDto,
    );

    const notificationId = await this.baseNotificationsRepository.create(
      userId,
      validatedNotificationDto,
    );

    if (!notificationId)
      throw new InternalServerErrorException(
        'Error while creating notification',
      );

    return { id: notificationId };
  }

  async delete(
    userId: User['id'],
    notificationId: Notification['id'],
  ): Promise<void> {
    await this.baseNotificationsRepository.delete(userId, notificationId);
  }

  async edit(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateNotificationDtoT,
  ): Promise<{ id: Notification['id'] }> {
    const validatedNotificationDto = await this.validateUpdateDto(
      updateNotificationDto,
    );

    const affectedRows = await this.baseNotificationsRepository.edit(
      userId,
      notificationId,
      validatedNotificationDto,
    );

    if (!affectedRows) throw new NotFoundException('Notification not found');

    return { id: notificationId };
  }

  abstract send(
    userId: User['id'],
    notification: Notification,
  ): Promise<{ referenceId: string }>;

  getDetailedNotification(
    userId: User['id'],
    notification: Notification,
  ): Promise<DetailedNotification> {
    return Promise.resolve(notification as DetailedNotification);
  }

  async validateCreateDto(dtoValue: CreateNotificationDTO) {
    return await validateClass(CreateNotificationDTO, dtoValue);
  }

  async validateUpdateDto(dtoValue: UpdateNotificationDTO) {
    return await validateClass(UpdateNotificationDTO, dtoValue);
  }
}
