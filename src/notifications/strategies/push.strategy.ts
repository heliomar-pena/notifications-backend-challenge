import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { validateClass } from 'src/utils/validate-class';
import { NotificationsRepository } from '../notifications.repository';
import { NotificationsProviderClient } from 'src/clients/notifications-provider.client';
import { BaseNotificationStrategy } from './base-notification.strategy';
import { CreatePushNotificationDTO } from '../dto/create-push-notification.dto';
import { UpdatePushNotificationDTO } from '../dto/update-push-notification.dto';

@Injectable()
export class PushStrategy extends BaseNotificationStrategy<
  UpdatePushNotificationDTO,
  CreatePushNotificationDTO,
  Notification
> {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsProviderClient: NotificationsProviderClient,
  ) {
    super(notificationsRepository);
  }

  async send(
    userId: string,
    notification: Notification,
  ): Promise<{ referenceId: string }> {
    const result = await this.notificationsProviderClient.sendSMS(notification);

    return { referenceId: result };
  }

  async validateCreateDto(
    dtoValue: CreatePushNotificationDTO,
  ): Promise<CreatePushNotificationDTO> {
    return await validateClass(CreatePushNotificationDTO, dtoValue);
  }

  async validateUpdateDto(
    dtoValue: UpdatePushNotificationDTO,
  ): Promise<UpdatePushNotificationDTO> {
    return await validateClass(UpdatePushNotificationDTO, dtoValue);
  }
}
