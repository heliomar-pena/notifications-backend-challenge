import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { ApiBody, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: OmitType<User, 'id'>,
  })
  login(@Req() req: Request & { user: User['id'] }) {
    if (!req.user) throw new UnauthorizedException();

    return this.authService.login(req.user);
  }

  @Public()
  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
}
