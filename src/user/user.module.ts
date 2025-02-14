import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { userProviders } from './user.provider';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...userProviders, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
