import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePushNotificationDTO } from './create-push-notification.dto';

export class UpdatePushNotificationDTO extends PartialType(
  OmitType(CreatePushNotificationDTO, ['channel']),
) {}
