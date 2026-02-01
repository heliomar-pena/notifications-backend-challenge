import { Module } from '@nestjs/common';
import { EmailNotificationsRepository } from './email-notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotifications } from './entities/email-notifications.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { ConfigModule } from '@nestjs/config';
import emailConfig from 'src/clients/email.config';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    ClientsModule,
    ConfigModule.forFeature(emailConfig),
    TypeOrmModule.forFeature([Notification, EmailNotifications]),
  ],
  providers: [EmailNotificationsRepository],
  exports: [EmailNotificationsRepository],
})
export class EmailNotificationsModule {}
