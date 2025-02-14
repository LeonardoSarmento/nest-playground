import { DataSourceOptions } from 'typeorm';
import env from '../config/configuration';
import * as dotenv from 'dotenv';

/// Atualiza Variáveis de ambiente.
dotenv.config();

export const sqliteDataSource: DataSourceOptions = {
  type: 'sqlite',
  database: env().database.host || 'dev.db',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  synchronize: true,
};

export const psqlDataSource: DataSourceOptions = {
  type: 'postgres',
  username: env().database.user,
  password: env().database.pass,
  host: env().database.host,
  database: env().database.name,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // synchronize: true,
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  logging: ['query'],
};
