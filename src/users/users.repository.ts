import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User['id'] | undefined> {
    const result = await this.usersRepository.insert(createUserDto);

    return result.identifiers[0].id as User['id'];
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: User['id']) {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  findByEmail(email: User['email']) {
    return this.usersRepository.findOneBy({ email: email });
  }
}
