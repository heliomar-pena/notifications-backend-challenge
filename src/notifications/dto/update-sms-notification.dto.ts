import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSMSNotificationDTO } from './create-sms-notification.dto';

export class UpdateSMSNotificationDTO extends PartialType(
  OmitType(CreateSMSNotificationDTO, ['channel']),
) {}
