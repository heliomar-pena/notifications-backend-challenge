import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationStrategy } from './notification-strategy.interface';
import { User } from 'src/users/entities/user.entity';
import { UpdateEmailNotificationDTO } from '../../email-notifications/dto/update-email-notification.dto';
import { Notification } from '../entities/notification.entity';
import { EmailTemplatesRepository } from 'src/email-templates/email-templates.repository';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { EmailNotificationsRepository } from 'src/email-notifications/email-notifications.repository';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';

@Injectable()
export class EmailStrategy implements NotificationStrategy {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
    private readonly emailNotificationsRepository: EmailNotificationsRepository,
  ) {}

  async #getUserTemplateOrFail(
    userId: User['id'],
    templateId: EmailTemplates['id'],
  ) {
    const template = await this.emailTemplatesRepository.getUserTemplate(
      userId,
      templateId,
    );

    if (!template) {
      throw new NotFoundException(
        `Template with ID ${templateId} was not found`,
      );
    }

    return template;
  }

  async create(
    userId: User['id'],
    createNotificationDto: Omit<CreateEmailNotificationDto, 'notification_id'>,
  ) {
    const template = await this.#getUserTemplateOrFail(
      userId,
      createNotificationDto.template_id,
    );

    const result =
      await this.emailNotificationsRepository.createEmailNotification(
        userId,
        createNotificationDto,
        template,
      );

    if (!result.id) {
      throw new InternalServerErrorException(
        'There was an error while creating email notification.',
      );
    }

    return { id: result.id };
  }

  async edit(
    userId: User['id'],
    notificationId: Notification['id'],
    updateNotificationDto: UpdateEmailNotificationDTO,
  ) {
    if (updateNotificationDto.template_id) {
      await this.#getUserTemplateOrFail(
        userId,
        updateNotificationDto.template_id,
      );
    }

    const affectedRows =
      await this.emailNotificationsRepository.updateEmailNotification(
        userId,
        notificationId,
        updateNotificationDto,
      );

    if (!affectedRows) {
      throw new NotFoundException('Notification not found');
    }

    return { id: notificationId };
  }

  async delete(userId: User['id'], notificationId: Notification['id']) {
    await this.emailNotificationsRepository.deleteEmailNotification(
      userId,
      notificationId,
    );
  }

  async getNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    return await this.emailNotificationsRepository.getUserEmailNotification(
      userId,
      notificationId,
    );
  }
}
