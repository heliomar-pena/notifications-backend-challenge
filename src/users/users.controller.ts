import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReqUser } from 'src/auth/decorators/request-user.decorator';
import { RequestUserDto } from 'src/auth/dto/request-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@ReqUser() user: RequestUserDto) {
    return this.usersService.findOne(user.id);
  }
}
