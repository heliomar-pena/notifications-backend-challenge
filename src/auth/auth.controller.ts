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
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Public } from './public-route.decorator';
import { LoginUserDTO } from './dto/login-user.dto';
import { ReqUser } from './decorators/request-user.decorator';
import { RequestUserDto } from './dto/request-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'Authenticate with email and password.',
  })
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
  @ApiOperation({ summary: 'Create a new user with email and password.' })
  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
}
