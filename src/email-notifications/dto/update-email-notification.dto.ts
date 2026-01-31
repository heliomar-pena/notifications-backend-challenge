import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';

export class UpdateEmailNotificationDTO extends PartialType(
  CreateEmailNotificationDto,
) {
  @IsString()
  @ApiProperty()
  notification_id: string;
}
