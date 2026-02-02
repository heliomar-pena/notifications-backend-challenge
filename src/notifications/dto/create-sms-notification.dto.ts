import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDTO } from './create-notification.dto';
import { IsArray, IsPhoneNumber, MaxLength } from 'class-validator';

export class CreateSMSNotificationDTO extends CreateNotificationDTO {
  @ApiProperty()
  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  declare destinations: string[];

  @MaxLength(160)
  declare content: string;
}
