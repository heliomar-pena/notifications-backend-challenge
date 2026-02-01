import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

export class UserInfoDto extends PickType(CreateUserDto, ['email']) {
  id: User['id'];
}
