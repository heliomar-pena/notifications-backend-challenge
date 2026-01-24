import { Test } from '@nestjs/testing';
import { ConfigModule } from 'src/const/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { DataSource } from 'typeorm';

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [ConfigModule, DatabaseModule],
  }).compile();

  const dataSource = module.get(DataSource);

  // CREATE DB IF NOT EXISTS  
  dataSource.sql()
});
