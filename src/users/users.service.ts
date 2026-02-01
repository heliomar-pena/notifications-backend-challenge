import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: User['id']) {
    const user = await this.usersRepository.findOne(id);

    return {
      id: user?.id,
      email: user?.email,
    };
  }

  findByUsername(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
