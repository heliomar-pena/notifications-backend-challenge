import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationFactory } from './strategies/notification-factory.service';
import { EmailNotificationsModule } from 'src/email-notifications/email-notifications.module';
import { EmailStrategy } from './strategies/email.strategy';
import { EmailTemplatesModule } from 'src/email-templates/email-templates.module';
import { NotificationsProviderModule } from 'src/clients/notifications-provider.module';
import { SMSStrategy } from './strategies/sms.strategy';
import { PushStrategy } from './strategies/push.strategy';

@Module({
  imports: [
    EmailTemplatesModule,
    EmailNotificationsModule,
    NotificationsProviderModule,
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsRepository,
    NotificationsService,
    NotificationFactory,
    EmailStrategy,
    PushStrategy,
    SMSStrategy,
  ],
})
export class NotificationsModule {}
