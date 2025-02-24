import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PostEntity),
    inject: ['DATA_SOURCE'],
  },
];
