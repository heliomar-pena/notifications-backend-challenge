import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiBearerAuth()
  me(@ReqUser() user: RequestUserDto) {
    return this.usersService.findOne(user.id);
  }
}
