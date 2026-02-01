import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEmailNotificationDTO } from 'src/email-notifications/dto/create-email-notification';

export class UpdateEmailNotificationDTO extends PartialType(
  OmitType(CreateEmailNotificationDTO, ['channel']),
) {}
