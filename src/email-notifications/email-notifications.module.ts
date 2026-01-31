import { Module } from '@nestjs/common';
import { EmailNotificationsRepository } from './email-notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotifications } from './entities/email-notifications.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, EmailNotifications])],
  providers: [EmailNotificationsRepository],
  exports: [EmailNotificationsRepository],
})
export class EmailNotificationsModule {}
