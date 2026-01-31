import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from 'src/email-templates/dto/create-template.dto';
import { EmailTemplatesRepository } from './email-templates.repository';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(
    private readonly emailTemplatesRepository: EmailTemplatesRepository,
  ) {}

  async createTemplate(userId: string, createTemplateDto: CreateTemplateDto) {
    return this.emailTemplatesRepository.createTemplate(
      userId,
      createTemplateDto,
    );
  }

  async getUserTemplates(userId: string) {
    return this.emailTemplatesRepository.getUserDetailedTemplates(userId);
  }

  async updateTemplate(
    templateId: string,
    userId: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.emailTemplatesRepository.updateUserTemplate(
      templateId,
      userId,
      updateTemplateDto,
    );
  }

  async deleteTemplate(templateId: string, userId: string) {
    return this.emailTemplatesRepository.deleteTemplate(userId, templateId);
  }

  async publishTemplate(templateId: string, userId: string) {
    return this.emailTemplatesRepository.publishTemplate(userId, templateId);
  }
}
