import { Inject, Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Resend } from 'resend';
import { ConfigType } from '@nestjs/config';
import emailConfig from './email.config';

@Injectable()
export class EmailClient {
  private resend;

  constructor(
    @Inject(emailConfig.KEY)
    private emailEnvs: ConfigType<typeof emailConfig>,
  ) {
    this.resend = new Resend(emailEnvs.apiKey);
  }

  createTemplate(createTemplateDto: CreateTemplateDto) {}
}
