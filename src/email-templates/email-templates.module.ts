import { Module } from '@nestjs/common';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplatesService } from './email-templates.service';
import { EmailClient } from 'src/clients/email.client';
import emailConfig from 'src/clients/email.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplates } from './entities/email-templates.entity';
import { EmailTemplatesRepository } from './email-templates.repository';

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    TypeOrmModule.forFeature([EmailTemplates]),
  ],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesService, EmailTemplatesRepository, EmailClient],
  exports: [EmailTemplatesRepository],
})
export class EmailTemplatesModule {}
