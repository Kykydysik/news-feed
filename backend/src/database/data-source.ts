import { getDatabaseConfig } from './database.config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  ...getDatabaseConfig(),
  migrations: ['src/database/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});
