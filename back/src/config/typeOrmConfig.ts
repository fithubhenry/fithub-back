import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import ENV from './enviroments';

const config = {
  type: 'postgres',
  database: ENV.DB_NAME,
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migration: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: ['error'],
  synchronize: true,
  dropSchema: false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
