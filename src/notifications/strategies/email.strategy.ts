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
import { EmailNotifications } from 'src/email-notifications/entities/email-notifications.entity';
import { validateClass } from 'src/utils/validate-class';

type DetailedNotification = Partial<EmailNotifications & Notification>;

@Injectable()
export class EmailStrategy implements NotificationStrategy<DetailedNotification> {
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
    createNotificationDto: CreateEmailNotificationDto,
  ) {
    const createEmailNotificationDto = await validateClass(
      CreateEmailNotificationDto,
      createNotificationDto,
    );

    const template = await this.#getUserTemplateOrFail(
      userId,
      createEmailNotificationDto.template_id!,
    );

    const result =
      await this.emailNotificationsRepository.createEmailNotification(
        userId,
        createEmailNotificationDto,
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
    const updateEmailNotificationDto = await validateClass(
      UpdateEmailNotificationDTO,
      updateNotificationDto,
    );

    if (updateEmailNotificationDto.template_id) {
      await this.#getUserTemplateOrFail(
        userId,
        updateEmailNotificationDto.template_id,
      );
    }

    const affectedRows =
      await this.emailNotificationsRepository.updateEmailNotification(
        userId,
        notificationId,
        updateEmailNotificationDto,
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

  async getDetailedNotification(
    userId: string,
    notification: Notification,
  ): Promise<DetailedNotification> {
    const emailNotification =
      await this.emailNotificationsRepository.getUserEmailNotification(
        userId,
        notification.id,
      );

    return {
      ...notification,
      ...emailNotification,
      id: notification.id,
    };
  }

  async send(
    userId: User['id'],
    notification: Notification,
  ): Promise<{ referenceId: string }> {
    const emailNotification =
      await this.emailNotificationsRepository.getUserEmailNotification(
        userId,
        notification.id,
      );

    if (!emailNotification) throw new NotFoundException();

    const referenceId = await this.emailNotificationsRepository.send(
      notification,
      emailNotification,
    );

    if (!referenceId)
      throw new InternalServerErrorException('Failed to send notification');

    return { referenceId: referenceId };
  }
}
