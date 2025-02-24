import { forwardRef, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { filesProviders } from './file.providers';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './file.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './upload',
    }),
    forwardRef(() => PostModule),
  ],
  controllers: [FileController],
  providers: [FileService, ...filesProviders, FileRepository],
  exports: [FileService],
})
export class FileModule {}
