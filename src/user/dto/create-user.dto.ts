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
}

export type UserCreateDtoType = Pick<
  Partial<UserCreateDto>,
  'username' | 'email' | 'birthday'
>;
