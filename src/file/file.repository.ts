import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileRepository {
  constructor(
    @Inject('FILE_REPOSITORY')
    private readonly _repository: Repository<FileEntity>,
  ) {}

  async insertFile(createFileDto: CreateFileDto) {
    return await this._repository.save(createFileDto);
  }

  async findAll() {
    return await this._repository.find();
  }

  async findOne(id: string) {
    return await this._repository.findOne({ where: { id } });
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    return await this._repository.update(id, updateFileDto);
  }

  async remove(id: string) {
    return await this._repository.delete(id);
  }
}
