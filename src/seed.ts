import { DataSource } from 'typeorm';
import { databaseProviders } from './database/database.providers';
import { UserCreateDto, UserCreateDtoType } from './user/dto/create-user.dto';
import { USER_ROLE_CODE } from './user/enums/role.enum';
import { UserEntity } from './user/entities/user.entity';

async function seed() {
  const resetDb: string | boolean | undefined = process.env.npm_config_reset;
  const dbSource: DataSource = await databaseProviders[0].useFactory();

  if (resetDb && resetDb === 'true') {
    console.debug('Dropping Database...');
    await dbSource.createQueryRunner().dropSchema('public', true, true);
    console.debug('Schema dropped...');

    console.debug('Creating schema...');
    await dbSource.createQueryRunner().createSchema('public');
    console.debug('Schema created...');

    console.debug('Running migrations...');
    await dbSource.runMigrations();
    console.debug('Database dropped...');
  }

  await (async () => {
    const DtoList: UserCreateDtoType[] = [
      {
        username: 'leonardo',
        password: '12qwaszx',
        email: 'mail@mail.com',
        role: USER_ROLE_CODE.ADMIN,
        birthday: new Date('1996-02-07'),
      },
    ];
    const TRepository = dbSource.getRepository(UserEntity);
    const TList = DtoList.map((v) => new UserCreateDto(v).toEntity());
    await TRepository.save(TList);
  })();

  await dbSource.destroy();
}

seed()
  .then(() => console.log('\nSeed finished with success.\n'))
  .catch((ex) => console.error('\nSeed fail.\n', ex));
