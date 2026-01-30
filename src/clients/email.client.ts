import { Inject, Injectable } from '@nestjs/common';
import { CreateTemplateDto } from '../email-templates/dto/create-template.dto';
import { Resend } from 'resend';
import type { ConfigType } from '@nestjs/config';
import emailConfig from './email.config';
import { EmailClientError } from './email.error';
import { UpdateTemplateDto } from 'src/email-templates/dto/update-template.dto';

@Injectable()
export class EmailClient {
  private resend: Resend;

  constructor(
    @Inject(emailConfig.KEY)
    private emailEnvs: ConfigType<typeof emailConfig>,
  ) {
    this.resend = new Resend(emailEnvs.apiKey);
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
}
