import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private auth: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return null;

    const doesPasswordMatch = await bcrypt.compare(pass, user.password);

    if (user && doesPasswordMatch) {
      return {
        email: user.email,
        id: user.id,
      };
    }

    return null;
  }

  login(userId: User['id']) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findByEmail(createUserDto.email);

    if (user) throw new ConflictException();

    const password = await bcrypt.hash(createUserDto.password, this.auth.salt);

    const id = await this.usersRepository.create({
      email: createUserDto.email,
      password,
    });

    if (!id) throw new InternalServerErrorException();

    return this.login(id);
  }
}
