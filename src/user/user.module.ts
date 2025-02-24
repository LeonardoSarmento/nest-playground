import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { userProviders } from './user.providers';

@Module({
  controllers: [UserController],
  providers: [UserService, ...userProviders, UserRepository],
  exports: [UserService],
})
export class UserModule {}
