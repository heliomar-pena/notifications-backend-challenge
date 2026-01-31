import { Inject, Injectable } from '@nestjs/common';
import { CreateTemplateDto } from '../email-templates/dto/create-template.dto';
import { Resend } from 'resend';
import type { ConfigType } from '@nestjs/config';
import emailConfig from './email.config';
import { EmailClientError } from './email.error';
import { UpdateTemplateDto } from 'src/email-templates/dto/update-template.dto';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';
import { EmailNotifications } from 'src/email-notifications/entities/email-notifications.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Injectable()
export class EmailClient {
  private resend: Resend;

  constructor(
    @Inject(emailConfig.KEY)
    private emailEnvs: ConfigType<typeof emailConfig>,
  ) {
    this.resend = new Resend(emailEnvs.apiKey);
  }

  async sendEmail(
    subject: string,
    to: Notification['destinations'],
    templateId: EmailTemplates['template_id'],
    variables: EmailNotifications['variables'],
  ) {
    const result = await this.resend.emails.send({
      subject,
      from: this.emailEnvs.fromEmail,
      to,
      template: {
        id: templateId,
        variables: variables,
      },
    });

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data.id;
  }

  async createTemplate(createTemplateDto: CreateTemplateDto) {
    const result = await this.resend.templates.create(createTemplateDto);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async getTemplate(id: string) {
    const result = await this.resend.templates.get(id);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async getTemplates(idList: string[]) {
    return await Promise.all(idList.map(async (id) => this.getTemplate(id)));
  }

  async updateTemplate(
    templateId: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    const result = await this.resend.templates.update(
      templateId,
      updateTemplateDto,
    );

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async deleteTemplate(templateId: string) {
    const result = await this.resend.templates.remove(templateId);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async publishTemplate(templateId: string) {
    const result = await this.resend.templates.publish(templateId);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }
}
