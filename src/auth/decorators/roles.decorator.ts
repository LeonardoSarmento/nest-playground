import { Reflector } from '@nestjs/core';
import { USER_ROLE_CODE } from 'src/user/enums/role.enum';

export const Roles = Reflector.createDecorator<USER_ROLE_CODE[]>();
