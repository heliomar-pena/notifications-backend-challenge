import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplates } from './entities/email-templates.entity';
import { EmailClient } from 'src/clients/email.client';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class EmailTemplatesRepository {
  constructor(
    private readonly emailClient: EmailClient,
    @InjectRepository(EmailTemplates)
    private emailTemplatesRepository: Repository<EmailTemplates>,
  ) {}

  async getUserTemplates(userId: string) {
    return await this.emailTemplatesRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getUserTemplate(userId: string, templateId: string) {
    return await this.emailTemplatesRepository.findOne({
      where: { user: { id: userId }, id: templateId },
    });
  }

  async createTemplate(userId: string, createTemplateDto: CreateTemplateDto) {
    const template = this.emailTemplatesRepository.create({
      user: { id: userId },
    });

    const clientResult =
      await this.emailClient.createTemplate(createTemplateDto);

    template.template_id = clientResult.id;

    await this.emailTemplatesRepository.save(template);

    return { id: template.id };
  }

  async getUserDetailedTemplates(userId: string) {
    const userTemplates = await this.getUserTemplates(userId);

    if (!userTemplates.length) return [];

    const templateDetails = await this.emailClient.getTemplates(
      userTemplates.map((template) => template.template_id),
    );

    return templateDetails.map((template) => ({
      ...template,
      id: userTemplates.find(({ template_id }) => template_id === template.id)
        ?.id,
    }));
  }

  async getUserDetailedTemplate(userId: string, templateId: string) {
    const userTemplate = await this.emailTemplatesRepository.findOne({
      where: { user: { id: userId }, id: templateId },
    });

    if (!userTemplate) throw new NotFoundException();

    const templateDetails = await this.emailClient.getTemplate(userTemplate.id);

    return templateDetails;
  }

  async updateUserTemplate(
    templateId: string,
    userId: string,
    updateTemplateDto: UpdateTemplateDto,
  ) {
    const template = await this.getUserTemplate(userId, templateId);

    if (!template) {
      throw new NotFoundException();
    }

    await this.emailClient.updateTemplate(
      template.template_id,
      updateTemplateDto,
    );

    return { id: template.id };
  }

  async deleteTemplate(userId: string, templateId: string) {
    const template = await this.getUserTemplate(userId, templateId);

    if (!template) {
      throw new NotFoundException();
    }

    const clientResult = await this.emailClient.deleteTemplate(
      template.template_id,
    );

    await this.emailTemplatesRepository.remove(template);

    return clientResult;
  }

  async publishTemplate(userId: string, templateId: string) {
    const template = await this.getUserTemplate(userId, templateId);

    if (!template) {
      throw new NotFoundException();
    }

    const clientResult = await this.emailClient.publishTemplate(
      template.template_id,
    );

    return clientResult;
  }
}
