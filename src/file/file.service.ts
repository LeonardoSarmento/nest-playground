import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(private readonly _fileRepository: FileRepository) {}

  async create(createFileDto: CreateFileDto) {
    return await this._fileRepository.insertFile(createFileDto);
  }

  async findAll() {
    return await this._fileRepository.findAll();
  }

  async findOne(id: string) {
    return await this._fileRepository.findOne(id);
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    return await this._fileRepository.update(id, updateFileDto);
  }

  async remove(id: string) {
    return await this._fileRepository.remove(id);
  }
}
