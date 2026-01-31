import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Channel } from 'src/enums/channel.enum';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ChannelValidationPipe implements PipeTransform {
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

    const dto = plainToInstance(dtoClass, value);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(this.#formatErrors(errors));
    }

    return dto;
  }

  #formatErrors(errors: ValidationError[]): string[] {
    return errors.map((error) => {
      const constraints = error.constraints;
      if (constraints) {
        return Object.values(constraints).join(', ');
      }
      return '';
    });
  }
}
