import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailClient } from './email.client';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './email.config';
import { NotificationsProviderClient } from './notifications-provider.client';
import notificationsProviderConfig from './notifications-provider.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(emailConfig),
    ConfigModule.forFeature(notificationsProviderConfig),
  ],
  providers: [EmailClient, NotificationsProviderClient],
  exports: [NotificationsProviderClient, EmailClient],
})
export class ClientsModule {}
