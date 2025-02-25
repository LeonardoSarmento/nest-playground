import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { postProviders } from './post.providers';
import { UserModule } from '../user/user.module';
import { PostRepository } from './post.repository';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [PostController],
  providers: [PostService, ...postProviders, PostRepository],
  exports: [PostService],
})
export class PostModule {}
