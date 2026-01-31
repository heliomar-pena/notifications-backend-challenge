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
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { CreateEmailNotificationDto } from 'src/email-notifications/dto/create-email-notification';
import { CreateChannelValidationPipe } from './pipes/create-channel-validation.pipe';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('')
  @ApiBearerAuth()
  getMyNotifications(@ReqUser() user: RequestUserDto) {
    return this.notificationsService.myNotifications(user.id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  getDetailedNotification(
    @ReqUser() user: RequestUserDto,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.getDetailedNotification(
      user.id,
      notificationId,
    );
  }

  @ApiExtraModels(CreateEmailNotificationDto, CreateNotificationDto)
  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  createNotification(
    @Body(new CreateChannelValidationPipe())
    createNotificationDto: CreateEmailNotificationDto,
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
    @Body()
    updateNotificationDto: UpdateNotificationDTO,
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
