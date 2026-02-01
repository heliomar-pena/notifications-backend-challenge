import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsProviderClient } from './notifications-provider.client';
import notificationsProviderConfig from './notifications-provider.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(notificationsProviderConfig)],
  providers: [NotificationsProviderClient],
  exports: [NotificationsProviderClient],
})
export class NotificationsProviderModule {}
