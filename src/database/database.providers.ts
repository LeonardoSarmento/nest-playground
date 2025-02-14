import { DataSource, type DataSourceOptions } from 'typeorm';
import { sqliteDataSource, psqlDataSource } from './typeorm.config';
import env from '../config/configuration';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      let dbSource: DataSourceOptions;
      // console.debug(env().database);

      if (env().database.drive === 'sqlite') {
        dbSource = sqliteDataSource;
      } else if (env().database.drive === 'postgres') {
        dbSource = psqlDataSource;
      } else {
        console.warn('Drive DB não informado, utilizando SQLite.');
        dbSource = sqliteDataSource;
      }

      return new DataSource({ ...dbSource }).initialize();
    },
  },
];
