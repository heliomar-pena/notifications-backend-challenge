import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDTO } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { DetailedEmailNotificationDTO } from './dto/detailed-email-notification.dto';
import { ApiGetDetailedNotificationSwagger } from './swagger/get-detailed-notification.swagger';
import { ApiCreateNotificationSwagger } from './swagger/create-notification.swagger';
import { ApiEditNotificationSwagger } from './swagger/api-edit-notification.swagger';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Current user notifications.',
    description:
      'Returns all the notifications created for the current user. Notifications are limited to the basic information of every notification, to check details of a specific notification (like the templates or variables used in a Email notification), use the GET /notifications/{id} endpoint.',
  })
  @ApiResponse({
    type: [Notification],
  })
  getMyNotifications(@ReqUser() user: RequestUserDto) {
    return this.notificationsService.myNotifications(user.id);
  }

  @Get('/:id')
  @ApiExtraModels(DetailedEmailNotificationDTO)
  @ApiOperation({
    summary: 'Get user created notification with details.',
    description:
      'Returns the notification with details of the specific channel, for example, if channel is e-mail will return the notification with template and variables',
  })
  @ApiGetDetailedNotificationSwagger()
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

  @Post()
  @ApiOperation({
    summary: 'Create a notification in mode DRAFT.',
    description:
      'Creates a notification in mode DRAFT. Can be refined in the PUT endpoint before sending the notification. The Request body varies depending on the notification channel.',
  })
  @ApiCreateNotificationSwagger()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  createNotification(
    @Body()
    createNotificationDto: CreateNotificationDTO,
    @ReqUser() user: RequestUserDto,
  ) {
    return this.notificationsService.createNotification(
      user.id,
      createNotificationDto,
    );
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Edits a notification that is in mode DRAFT.',
    description:
      'Edits a notification in mode DRAFT. Notifications that are already sent can not be edited. The body of the request can vary depending on the channel of the notification.',
  })
  @ApiEditNotificationSwagger()
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
  @ApiOperation({
    description:
      'Deletes a notification from our system. It does not reverts the status of a sent notification.',
  })
  deleteNotification(
    @ReqUser() user: RequestUserDto,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.deleteNotification(
      user.id,
      notificationId,
    );
  }

  @Post('/send-notification/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send notification',
    description:
      'Once your notification is ready to go, just send it with this endpoint. Once sent, the external ID is saved in reference_id column. Only notifications in status DRAFT are valid in this endpoint.',
  })
  sendNotification(
    @ReqUser() user: RequestUserDto,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.sendNotification(user.id, notificationId);
  }
}
