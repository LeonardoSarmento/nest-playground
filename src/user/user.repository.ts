import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserUniquesDto } from './dto/unique-user.dto';
import { Helpers } from '../helpers/helpers.global';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly _repository: Repository<UserEntity>,
  ) {}

  public async create(user: UserEntity): Promise<UserEntity> {
    return this._repository.save(user);
  }

  public async findAll(): Promise<UserEntity[]> {
    return this._repository.find();
  }

  private async getById(id: number): Promise<UserEntity | null> {
    return this._repository.findOne({ where: { id } });
  }

  public async findOne(id: number): Promise<UserEntity | null> {
    return this.getById(id);
  }

  public async safeFindByUnique(
    uniques: UserUniquesDto,
  ): Promise<UserEntity | null> {
    if (Object.keys(uniques).length === 0) return null;
    const user = await this._repository.findOne({
      where: [
        { id: uniques.id },
        { username: uniques.username },
        { email: uniques.email },
      ],
    });
    return user;
  }

  public async findByUnique(
    uniques: UserUniquesDto,
  ): Promise<UserEntity | null> {
    if (Object.keys(uniques).length === 0) return null;

    const user = await this._repository.findOne({
      where: [
        { id: uniques.id },
        { username: uniques.username },
        { email: uniques.email },
      ],
    });

    return user && Helpers.isMatching<UserEntity>(user, uniques) ? user : null;
  }

  public async update(
    id: number,
    user: UserUpdateDto,
  ): Promise<UserEntity | null> {
    const existingUser = await this.getById(id);
    if (!existingUser) return null;

    await this._repository.update(id, user);
    return this.getById(id);
  }

  public async remove(id: number): Promise<UserEntity | null> {
    const user = await this.getById(id);
    if (!user) return null;

    await this._repository.delete(id);
    return user;
  }
}
