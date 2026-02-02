import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDTO } from './create-notification.dto';
import { IsArray, IsString, Length } from 'class-validator';

export class CreatePushNotificationDTO extends CreateNotificationDTO {
  @ApiProperty()
  @IsArray()
  @IsString({ message: 'Destination must be a FCM Token', each: true })
  @Length(100, 250, { message: 'Token length is invalid', each: true })
  declare destinations: string[];
}
