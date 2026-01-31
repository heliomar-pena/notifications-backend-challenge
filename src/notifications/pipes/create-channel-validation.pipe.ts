import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Channel } from 'src/enums/channel.enum';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { validateClass } from 'src/utils/validate-class';

@Injectable()
export class CreateChannelValidationPipe implements PipeTransform {
  async transform(
    value:
      | CreateEmailNotificationDto
      | (Omit<CreateNotificationDto, 'channel'> & { channel: 'sms' | 'push' }),
  ) {
    let dtoClass: new () => CreateEmailNotificationDto | CreateNotificationDto;

    switch (value.channel) {
      case Channel.EMAIL:
        dtoClass = CreateEmailNotificationDto;
        break;
      case Channel.SMS:
      case Channel.PUSH:
        dtoClass = CreateNotificationDto;
        break;
      default:
        throw new BadRequestException('Invalid channel type');
    }

    return await validateClass(dtoClass, value);
  }
}
