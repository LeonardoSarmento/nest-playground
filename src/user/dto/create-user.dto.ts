import { UserEntity } from '../entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class UserCreateDto extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  constructor(dto?: UserCreateDtoType) {
    super();

    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(): UserEntity {
    const user = new UserEntity(this);
    if (this.password) {
      user.password = this.password;
    }
    return user;
  }
}

export type UserCreateDtoType = Pick<
  Partial<UserCreateDto>,
  'username' | 'email' | 'birthday' | 'role' | 'password'
>;
