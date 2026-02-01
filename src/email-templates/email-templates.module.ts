import { Module } from '@nestjs/common';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplatesService } from './email-templates.service';
import emailConfig from 'src/clients/email.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplates } from './entities/email-templates.entity';
import { EmailTemplatesRepository } from './email-templates.repository';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    ClientsModule,
    ConfigModule.forFeature(emailConfig),
    TypeOrmModule.forFeature([EmailTemplates]),
  ],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesService, EmailTemplatesRepository],
  exports: [EmailTemplatesRepository],
})
export class EmailTemplatesModule {}
