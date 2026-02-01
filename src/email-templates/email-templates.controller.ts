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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Creates a template that can be use later in a email Notification.',
    description:
      'A template is the body of the email, will contain common elements, like styles, images, etc... and accepts variables for dynamic content.',
  })
  @ApiResponse({
    schema: {
      example: {
        id: '1234',
      },
    },
  })
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
  @ApiOperation({
    summary:
      'Get email template. Get details on its HTML, variables and status.',
  })
  @ApiResponse({
    example: [
      {
        id: 'af2340e1-f317-4a23-8ae7-b50c3a80e6e5',
        name: 'My second template',
        status: 'draft',
        html: "<div style={{ background: 'red' }}>This gives style to my email, {{{A_VARIABLE_HERE}}}</div>",
        variables: [
          {
            key: 'A_VARIABLE_HERE',
            type: 'string',
            fallback_value: null,
          },
        ],
      },
    ],
  })
  getMyTemplates(@ReqUser() user: RequestUserDto) {
    return this.emailTemplatesService.getUserTemplates(user.id);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Edit a email template.',
  })
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
  @ApiOperation({
    summary: 'Delete an email template.',
  })
  deleteEmailTemplate(
    @Param('id') emailTemplateId: string,
    @ReqUser() user: RequestUserDto,
  ) {
    return this.emailTemplatesService.deleteTemplate(emailTemplateId, user.id);
  }

  @Post('/publish/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary:
      'Publish an email template. This will enable the email to be used in your emails.',
  })
  publishEmailTemplate(
    @Param('id') emailTemplateId: string,
    @ReqUser() user: RequestUserDto,
  ) {
    return this.emailTemplatesService.publishTemplate(emailTemplateId, user.id);
  }
}
