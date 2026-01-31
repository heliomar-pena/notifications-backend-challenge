import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { Channel } from 'src/enums/channel.enum';
import { ChannelValidationPipe } from './pipes/channel-validation.pipe';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('')
  @ApiBearerAuth()
  getMyNotifications(@ReqUser() user: RequestUserDto) {
    return this.notificationsService.myNotifications(user.id);
  }

  @ApiExtraModels(CreateEmailNotificationDto, CreateNotificationDto)
  @Post()
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(CreateNotificationDto),
        },
        {
          $ref: getSchemaPath(CreateEmailNotificationDto),
        },
      ],
      discriminator: {
        propertyName: 'channel',
        mapping: {
          [Channel.EMAIL]: getSchemaPath(CreateEmailNotificationDto),
          [Channel.SMS]: getSchemaPath(CreateNotificationDto),
          [Channel.PUSH]: getSchemaPath(CreateNotificationDto),
        },
      },
      examples: {
        emailExample: {
          value: {
            channel: 'email',
            email: 'user@example.com',
            subject: 'Welcome!',
            message: 'Welcome to our service!',
          },
        },
        smsExample: {
          value: {
            channel: 'sms',
            phoneNumber: '+1234567890',
            message: 'Your verification code is 12345.',
          },
        },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  createNotification(
    @Body(new ChannelValidationPipe())
    createNotificationDto:
      | CreateEmailNotificationDto
      | (Omit<CreateNotificationDto, 'channel'> & { channel: 'sms' | 'push' }),
    @ReqUser() user: RequestUserDto,
  ) {
    return this.notificationsService.createNotification(
      user.id,
      createNotificationDto,
    );
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  editNotification(
    @Body() updateNotificationDto: UpdateNotificationDTO,
    @ReqUser() user: RequestUserDto,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.editNotification(
      user.id,
      notificationId,
      updateNotificationDto,
    );
  }

  @Delete('/:id')
  @ApiBearerAuth()
  deleteNotification(
    @ReqUser() user: RequestUserDto,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.deleteNotification(
      user.id,
      notificationId,
    );
  }
}
