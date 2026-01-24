import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { InsertResult } from 'typeorm/browser';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../const/config.module';

const usersMock = [
  {
    id: 1,
    name: 'Pepe',
    password: 'longaniza',
  },
  {
    id: 3,
    name: 'Pep2e',
    password: 'longaniza',
  },
  {
    id: 6,
    name: 'Pep32e',
    password: 'longaniza',
  },
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersRepository: UsersRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature([User])],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
    }).compile();

    dataSource = module.get(DataSource);
    usersRepository = module.get(UsersRepository);
    usersController = module.get(UsersController);
  });

  afterEach(async () => {
    if (dataSource) {
      await dataSource.getRepository(User).clear();
      await dataSource.destroy();
    }
  });

  describe('When create is called', () => {
    describe('And parameters are fine', () => {
      let response: InsertResult;
      beforeEach(async () => {
        response = await usersController.create({
          name: 'Test',
          password: '123',
        });
      });

      it('Then should return InsertResult', () => {
        expect(response).not.toBe(undefined);
      });

      describe('And findAll method is called', () => {
        let findAllResult;
        beforeEach(async () => {
          findAllResult = await usersController.findAll();
        });

        it('Then should return the created user', () => {
          expect(findAllResult).toStrictEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: 'Test',
                password: '123',
              }),
            ]),
          );
        });
      });
    });
  });

  describe('When findAll is called', () => {
    describe('And repository found one or more users', () => {
      beforeEach(() => {
        jest.spyOn(usersRepository, 'findAll').mockResolvedValue(usersMock);
      });

      it('Then should return an array of users with username and password', async () => {
        expect(await usersController.findAll()).toBe(usersMock);
      });
    });
  });
});
