import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailNotifications } from './entities/email-notifications.entity';
import { Repository } from 'typeorm';
import { CreateEmailNotificationDTO } from './dto/create-email-notification.dto';
import { Notification } from 'src/notifications/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateEmailNotificationDTO } from './dto/update-email-notification.dto';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';
import { EmailClient } from 'src/clients/email.client';

@Injectable()
export class EmailNotificationsRepository {
  constructor(
    @InjectRepository(EmailNotifications)
    private emailNotificationsRepository: Repository<EmailNotifications>,
    private emailClient: EmailClient,
  ) {}

  async createEmailNotification(
    userId: string,
    createEmailNotificationDTO: CreateEmailNotificationDTO,
    template: EmailTemplates,
  ): Promise<{
    id: Notification['id'];
  }> {
    return await this.emailNotificationsRepository.manager.transaction(
      async (manager) => {
        const emailNotification = manager
          .getRepository(EmailNotifications)
          .create({
            template: template,
            variables: createEmailNotificationDTO.variables,
          });
        const notification = manager.getRepository(Notification).create({
          channel: createEmailNotificationDTO.channel,
          content: createEmailNotificationDTO.content,
          title: createEmailNotificationDTO.title,
          destinations: createEmailNotificationDTO.destinations,
          user: { id: userId },
        });

        const resultNotification = await manager.save(notification);

        emailNotification.notification = resultNotification;

        const result = await manager.save(emailNotification);

        return {
          id: result.notification.id,
        };
      },
    );
  }

  async updateEmailNotification(
    userId: User['id'],
    notificationId: Notification['id'],
    updateEmailNotificationDto: UpdateEmailNotificationDTO,
  ): Promise<number> {
    return await this.emailNotificationsRepository.manager.transaction(
      async (manager) => {
        const { content, template_id, variables, destinations, title } =
          updateEmailNotificationDto;

        const hasUpdatedNotification = !!content || !!destinations || !!title;
        const hasUpdatedEmailNotification = !!template_id || !!variables;

        if (!hasUpdatedEmailNotification && !hasUpdatedNotification) return 0;

        let resultNotificationAffected = 0;
        let resultEmailNotificationAffected = 0;

        if (hasUpdatedNotification) {
          resultNotificationAffected = await manager
            .getRepository(Notification)
            .update(
              { id: notificationId, user: { id: userId } },
              {
                content: updateEmailNotificationDto.content,
                destinations: updateEmailNotificationDto.destinations,
                title: updateEmailNotificationDto.title,
              },
            )
            .then((result) => result.affected ?? 0);
        }

        if (hasUpdatedEmailNotification) {
          resultEmailNotificationAffected = await manager
            .getRepository(EmailNotifications)
            .update(
              { notification: { id: notificationId, user: { id: userId } } },
              {
                variables: updateEmailNotificationDto.variables,
                ...(updateEmailNotificationDto.template_id && {
                  template: { id: updateEmailNotificationDto.template_id },
                }),
              },
            )
            .then((result) => result.affected ?? 0);
        }

        return resultEmailNotificationAffected + resultNotificationAffected;
      },
    );
  }

  async deleteEmailNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    return await this.emailNotificationsRepository.manager.transaction(
      async (manager) => {
        const resultEmailNotification = await manager
          .getRepository(EmailNotifications)
          .softDelete({
            notification: { id: notificationId, user: { id: userId } },
          });

        const resultNotification = await manager
          .getRepository(Notification)
          .softDelete({
            id: notificationId,
            user: { id: userId },
          });

        if (
          resultEmailNotification.affected !== 1 ||
          resultNotification.affected !== 1
        )
          throw new InternalServerErrorException(
            'Error deleting the notification.',
          );

        return resultEmailNotification.affected + resultNotification.affected;
      },
    );
  }

  async getUserEmailNotification(
    userId: User['id'],
    notificationId: Notification['id'],
  ) {
    return await this.emailNotificationsRepository.findOne({
      where: { notification: { user: { id: userId }, id: notificationId } },
      relations: {
        template: true,
      },
    });
  }

  async send(
    notification: Notification,
    emailNotification: EmailNotifications,
  ) {
    return await this.emailClient.sendEmail(
      notification.title,
      notification.destinations,
      emailNotification.template.template_id,
      emailNotification.variables,
    );
  }
}
