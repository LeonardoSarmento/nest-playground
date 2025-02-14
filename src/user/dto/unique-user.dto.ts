import { PartialType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserUniquesDto extends PartialType(
  PickType(UserEntity, ['id', 'username', 'email']),
) {}
