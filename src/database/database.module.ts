import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (configuration: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: configuration.host,
        port: configuration.port,
        username: configuration.username,
        password: configuration.password,
        database: configuration.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configuration.syncronize,
      }),
      inject: [databaseConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
