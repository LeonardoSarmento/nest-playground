import { DataSource, DataSourceOptions } from 'typeorm';
import { psqlDataSource, sqliteDataSource } from './typeorm.config';
import env from '../config/configuration';
import dotenv from 'dotenv';

dotenv.config();

function getRightDbSource() {
  let dbSource: DataSourceOptions;

  if (env().database.drive === 'sqlite') {
    dbSource = sqliteDataSource;
  } else if (env().database.drive === 'postgres') {
    dbSource = psqlDataSource;
  } else {
    console.warn('Drive DB não informado, utilizando SQLite.');
    dbSource = sqliteDataSource;
  }

  return dbSource;
}

export default new DataSource(getRightDbSource());
