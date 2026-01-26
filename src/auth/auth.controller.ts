import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Public } from './public-route.decorator';
import { LoginUserDTO } from './dto/login-user.dto';
import { ReqUser } from './decorators/request-user.decorator';
import { RequestUserDto } from './dto/request-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginUserDTO,
  })
  login(@Body() loginUserDO: LoginUserDTO, @ReqUser() user: RequestUserDto) {
    return this.authService.login(user.id);
  }

  @Public()
  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
}
