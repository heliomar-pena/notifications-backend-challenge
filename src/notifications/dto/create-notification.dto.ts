import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Channel } from 'src/enums/channel.enum';

export class CreateNotificationDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsEnum(Channel)
  channel: string;
}
