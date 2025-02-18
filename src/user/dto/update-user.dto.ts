import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserUpdateDto extends PartialType(
  OmitType(UserEntity, ['id', 'createdAt', 'updatedAt']),
) {
  @ApiHideProperty()
  updatedAt?: Date | undefined = new Date();

  constructor(dto?: UserUpdateDto) {
    super();

    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(): UserEntity {
    return new UserEntity(this);
  }
}
