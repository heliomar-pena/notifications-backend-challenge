import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConfig } from './auth.config';
import type { ConfigType } from '@nestjs/config';
import { RequestUserDto } from './dto/request-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private auth: ConfigType<typeof authConfig>,
  ) {
    super({
      secretOrKey: auth.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate(payload: { sub: string }): RequestUserDto {
    return { id: payload.sub };
  }
}
