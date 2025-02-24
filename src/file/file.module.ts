import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { filesProviders } from './file.provider';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { FileRepository } from './file.repository';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [FileController],
  providers: [FileService, ...filesProviders, FileRepository],
  exports: [FileService],
})
export class FileModule {}
