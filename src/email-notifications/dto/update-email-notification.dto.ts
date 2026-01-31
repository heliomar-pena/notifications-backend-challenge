import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';

export class UpdateEmailNotificationDTO extends PartialType(
  OmitType(CreateEmailNotificationDto, ['channel']),
) {}
