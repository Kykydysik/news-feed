import { config } from 'dotenv';
import { resolve } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config({ path: resolve(__dirname, '../../../.env') });

export function getDatabaseConfig(): TypeOrmModuleOptions &
  PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: Number(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'news_feed',
    autoLoadEntities: true,
    synchronize: false,
  };
}
