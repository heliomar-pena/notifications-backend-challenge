import { Module } from '@nestjs/common';
import { EmailNotificationsRepository } from './email-notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotifications } from './entities/email-notifications.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { EmailClient } from 'src/clients/email.client';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/clients/email.config';

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    TypeOrmModule.forFeature([Notification, EmailNotifications]),
  ],
  providers: [EmailNotificationsRepository, EmailClient],
  exports: [EmailNotificationsRepository],
})
export class EmailNotificationsModule {}
