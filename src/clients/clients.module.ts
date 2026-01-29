import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailClient } from './email.client';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './email.config';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(emailConfig)],
  providers: [EmailClient],
})
export class ClientsModule {}
