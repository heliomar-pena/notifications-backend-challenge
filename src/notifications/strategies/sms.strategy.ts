import { Injectable } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { validateClass } from 'src/utils/validate-class';
import { CreateSMSNotificationDTO } from '../dto/create-sms-notification.dto';
import { NotificationsRepository } from '../notifications.repository';
import { UpdateSMSNotificationDTO } from '../dto/update-sms-notification.dto';
import { NotificationsProviderClient } from 'src/clients/notifications-provider.client';
import { BaseNotificationStrategy } from './base-notification.strategy';

@Injectable()
export class SMSStrategy extends BaseNotificationStrategy<
  UpdateSMSNotificationDTO,
  CreateSMSNotificationDTO,
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
    dtoValue: CreateSMSNotificationDTO,
  ): Promise<CreateSMSNotificationDTO> {
    return await validateClass(CreateSMSNotificationDTO, dtoValue);
  }

  async validateUpdateDto(
    dtoValue: UpdateSMSNotificationDTO,
  ): Promise<UpdateSMSNotificationDTO> {
    return await validateClass(UpdateSMSNotificationDTO, dtoValue);
  }
}
