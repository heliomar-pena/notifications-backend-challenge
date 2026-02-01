import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDTO } from './create-notification.dto';
import { IsArray, IsPhoneNumber } from 'class-validator';

export class CreatePushNotificationDTO extends CreateNotificationDTO {
  @ApiProperty()
  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  declare destinations: string[];
}
