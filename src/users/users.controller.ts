import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Returns current the information for the user that is currently logged in.',
  })
  @ApiResponse({
    type: UserInfoDto,
  })
  me(@ReqUser() user: RequestUserDto) {
    return this.usersService.findOne(user.id);
  }
}
