import { OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserUpdateDto extends PartialType(
  OmitType(UserEntity, ['id', 'createdAt', 'updatedAt', 'posts']),
) {
  constructor(dto?: UserUpdateDto) {
    super();

    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(existingUser: UserEntity): UserEntity {
    Object.assign(existingUser, this);
    if (this.password) {
      existingUser.password = this.password;
    }
    return existingUser;
  }
}
