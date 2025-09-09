import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import ENV from './enviroments';

const isProd = !!process.env.DATABASE_URL;

const config = isProd
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL, // Render Internal DB URL
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: ['error'],
      synchronize: true, // ⚠️ mejor usar migraciones en prod
      ssl: {
        rejectUnauthorized: false, // necesario en Render
      },
    }
  : {
      type: 'postgres',
      database: ENV.DB_NAME,
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      username: ENV.DB_USERNAME,
      password: ENV.DB_PASSWORD,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: ['error'],
      synchronize: true, // desarrollo
      dropSchema: false,
    };

export const typeOrmConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
