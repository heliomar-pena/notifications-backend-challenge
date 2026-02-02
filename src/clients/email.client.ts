import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTemplateDto } from '../email-templates/dto/create-template.dto';
import type { ConfigType } from '@nestjs/config';
import emailConfig from './email.config';
import { EmailClientError } from './email.error';
import { UpdateTemplateDto } from 'src/email-templates/dto/update-template.dto';
import { EmailTemplates } from 'src/email-templates/entities/email-templates.entity';
import { EmailNotifications } from 'src/email-notifications/entities/email-notifications.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  EmailResponseError,
  EmailResponseSuccess,
} from './dto/EmailResponse.dto';
import { CreateResourceResponseDto } from './dto/CreateResourceResponse.dto';
import { SendEmailBodyDto } from './dto/SendEmailBody.dto';
import { EmailErrorResponseDto } from './dto/EmailErrorResponse.dto';
import { TemplateDetailsResponseDTO } from './dto/TemplateDetailsResponse.dto';

@Injectable()
export class EmailClient {
  constructor(
    private readonly httpService: HttpService,
    @Inject(emailConfig.KEY)
    private emailEnvs: ConfigType<typeof emailConfig>,
  ) {}

  async #sendRequest<Result, Body>(
    path: string,
    method: 'post' | 'patch' | 'get' | 'put' | 'delete',
    body?: Body,
  ): Promise<EmailResponseSuccess<Result> | EmailResponseError> {
    const config = {
      headers: {
        Authorization: `Bearer ${this.emailEnvs.apiKey}`,
      },
    };

    return await firstValueFrom(
      this.httpService[method]<Result>(
        `${this.emailEnvs.url}/${path}`,
        ['get', 'delete'].includes(method) ? config : body,
        config,
      ),
    )
      .then((res) => {
        return { data: res.data, error: null };
      })
      .catch((err: AxiosError<EmailErrorResponseDto>) => {
        const safeErrorResponse = {
          error: err.response?.data,
          data: null,
        } as EmailResponseError;

        if (!safeErrorResponse.error)
          throw new InternalServerErrorException(err.message);

        return safeErrorResponse;
      });
  }

  async sendEmail(
    subject: string,
    to: Notification['destinations'],
    templateId: EmailTemplates['template_id'],
    variables: EmailNotifications['variables'],
  ) {
    const result = await this.#sendRequest<
      CreateResourceResponseDto,
      SendEmailBodyDto
    >('emails', 'post', {
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
    const result = await this.#sendRequest<
      CreateResourceResponseDto,
      CreateTemplateDto
    >('templates', 'post', createTemplateDto);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async getTemplate(id: string) {
    const result = await this.#sendRequest<
      TemplateDetailsResponseDTO,
      undefined
    >(`templates/${id}`, 'get');

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
    const result = await this.#sendRequest<
      CreateResourceResponseDto,
      UpdateTemplateDto
    >(`templates/${templateId}`, 'patch', updateTemplateDto);

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async deleteTemplate(templateId: string) {
    const result = await this.#sendRequest(`templates/${templateId}`, 'delete');

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }

  async publishTemplate(templateId: string) {
    const result = await this.#sendRequest(
      `templates/${templateId}/publish`,
      'post',
    );

    if (result.error) {
      throw new EmailClientError(result.error);
    }

    return result.data;
  }
}
