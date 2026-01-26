import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ChannelValues } from 'src/enums/channel.enum';

export class CreateNotificationDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsEnum(ChannelValues)
  channel: string;
}
