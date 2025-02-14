import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUniquesDto } from './dto/unique-user.dto';
import { Helpers } from 'src/helpers/helpers.global';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly _repository: Repository<UserEntity>,
  ) {}

  async create(user: UserCreateDto): Promise<UserEntity> {
    return this._repository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this._repository.find();
  }

  private async getById(id: number): Promise<UserEntity | null> {
    return this._repository.findOne({ where: { id } });
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return this.getById(id);
  }

  async findByUnique(uniques: UserUniquesDto): Promise<UserEntity | null> {
    if (Object.keys(uniques).length === 0) return null;

    const user = await this._repository.findOne({
      where: [
        { id: uniques.id ?? undefined },
        { email: uniques.email ?? undefined },
      ],
    });

    return user && Helpers.isMatching<UserEntity>(user, uniques) ? user : null;
  }

  async update(id: number, user: UserUpdateDto): Promise<UserEntity | null> {
    const existingUser = await this.getById(id);
    if (!existingUser) return null;

    await this._repository.update(id, user);
    return this.getById(id);
  }

  async remove(id: number): Promise<UserEntity | null> {
    const user = await this.getById(id);
    if (!user) return null;

    await this._repository.delete(id);
    return user;
  }
}
