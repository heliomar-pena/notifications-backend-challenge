import { ConfigType } from '@nestjs/config';
import databaseConfig from '../database.config.js';
import { DataSourceOptions } from 'typeorm/browser';

const generateDataSourceConfig = (
  configuration: ConfigType<typeof databaseConfig>,
): DataSourceOptions => ({
  type: 'postgres',
  host: configuration.host,
  port: configuration.port,
  username: configuration.username,
  password: configuration.password,
  database: configuration.database,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: configuration.syncronize,
  migrations: configuration.migrations,
  migrationsTableName: 'migrations',
});

export default generateDataSourceConfig;
