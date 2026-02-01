import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Channel } from 'src/notifications/enums/channel.enum';
import type { ChannelValuesType } from 'src/notifications/enums/channel.enum';

export class CreateNotificationDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsEnum(Channel)
  channel: ChannelValuesType;

  @ApiProperty()
  @IsArray()
  destinations: string[];
}
