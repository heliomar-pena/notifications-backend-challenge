import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDTO } from './create-notification.dto';

export class UpdateNotificationDTO extends PartialType(
  OmitType(CreateNotificationDTO, ['channel']),
) {}
