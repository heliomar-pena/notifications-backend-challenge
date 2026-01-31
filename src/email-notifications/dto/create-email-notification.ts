import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailNotificationVariable } from '../decorators/is-email-notification-variable.decorator';

export class CreateEmailNotificationDto extends CreateNotificationDto {
  @ApiProperty()
  @IsArray()
  @IsEmail({}, { each: true })
  declare destinations: string[];

  @IsObject()
  @Validate(IsEmailNotificationVariable)
  @IsOptional()
  @ApiProperty()
  variables?: Record<string, string | number>;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  template_id?: string;
}
