import { UserEntity } from '../entities/user.entity';
import { ApiHideProperty, OmitType } from '@nestjs/swagger';

export class UserCreateDto extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @ApiHideProperty()
  id: UserEntity['id'];

  @ApiHideProperty()
  createdAt: UserEntity['createdAt'] = new Date();

  @ApiHideProperty()
  updatedAt: UserEntity['updatedAt'] = new Date();

  constructor(dto?: UserCreateDtoType) {
    super();

    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(): UserEntity {
    return new UserEntity(this);
  }
}

export type UserCreateDtoType = Pick<
  Partial<UserCreateDto>,
  'username' | 'email' | 'birthday' | 'role' | 'password'
>;
