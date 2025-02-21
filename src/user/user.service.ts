import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { UserUniquesDto } from './dto/unique-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly _repository: UserRepository) {}

  async create(createUserDto: UserCreateDto) {
    const noUserHasUniques = await this.findBySafeUnique(createUserDto);
    if (noUserHasUniques)
      throw new UnprocessableEntityException(
        'Alguns dados únicos de "Usuário" já em uso',
      );
    const user = createUserDto.toEntity();
    return this._repository.create(user);
  }

  async findAll() {
    return this._repository.findAll();
  }

  async findBySafeUnique(uniques: UserUniquesDto) {
    const user = await this._repository.safeFindByUnique(uniques);
    return user;
  }

  async findByUnique(uniques: UserUniquesDto) {
    const user = await this._repository.findByUnique(uniques);
    return user;
  }

  async findOne(id: UserEntity['id']) {
    const user = await this._repository.findOne(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: UserEntity['id'], updateUserDto: UserUpdateDto) {
    const updatedUser = await this._repository.update(id, updateUserDto);
    if (!updatedUser) throw new NotFoundException('Usuário não encontrado');
    return updatedUser;
  }

  async remove(id: UserEntity['id']) {
    const user = await this._repository.remove(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
