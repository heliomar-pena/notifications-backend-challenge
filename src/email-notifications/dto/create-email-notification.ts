import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateTemplateDto,
  TemplateVariableDto,
} from 'src/email-templates/dto/create-template.dto';
import { Channel } from 'src/enums/channel.enum';

export class CreateEmailNotificationDto extends CreateNotificationDto {
  @IsEnum([Channel.EMAIL])
  @ApiProperty({
    example: Channel.EMAIL,
  })
  declare channel: typeof Channel.EMAIL;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    type: TemplateVariableDto,
    isArray: true,
    description: 'Template variables',
  })
  variables: CreateTemplateDto['variables'];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  template_id: string;
}
