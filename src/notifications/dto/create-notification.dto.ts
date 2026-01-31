import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Channel } from 'src/enums/channel.enum';
import type { ChannelValuesType } from 'src/enums/channel.enum';

export class CreateNotificationDto {
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
