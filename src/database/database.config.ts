import { registerAs } from '@nestjs/config';

const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USERNAME || 'myuser',
  password: process.env.DATABASE_PASSWORD || 'mypassword',
  database: process.env.DATABASE || 'mydatabase',
  syncronize: process.env.DATABASE_SYNCRONIZE === 'true',
}));

export default databaseConfig;
