import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { ApiBody, OmitType } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: OmitType<User, 'id'>,
  })
  login(@Req() req: Request & { user: User['id'] }) {
    if (!req.user) throw new UnauthorizedException();

    return this.authService.login(req.user);
  }
}
