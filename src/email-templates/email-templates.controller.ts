import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { EmailTemplatesService } from './email-templates.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  createEmailTemplate(
    @ReqUser() user: RequestUserDto,
    @Body() createTemplateDto: CreateTemplateDto,
  ) {
    return this.emailTemplatesService.createTemplate(
      user.id,
      createTemplateDto,
    );
  }

  @Get()
  @ApiBearerAuth()
  getMyTemplates(@ReqUser() user: RequestUserDto) {
    return this.emailTemplatesService.getUserTemplates(user.id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  updateEmailTemplate(
    @Param('id') emailTemplateId: string,
    @ReqUser() user: RequestUserDto,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.emailTemplatesService.updateTemplate(
      emailTemplateId,
      user.id,
      updateTemplateDto,
    );
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  deleteEmailTemplate(
    @Param('id') emailTemplateId: string,
    @ReqUser() user: RequestUserDto,
  ) {
    return this.emailTemplatesService.deleteTemplate(emailTemplateId, user.id);
  }
}
