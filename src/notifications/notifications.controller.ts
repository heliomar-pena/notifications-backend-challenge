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
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDTO } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
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
  deleteNotification() {}

  @Get('/my-notifications')
  @ApiBearerAuth()
  getMyNotifications() {}
}
