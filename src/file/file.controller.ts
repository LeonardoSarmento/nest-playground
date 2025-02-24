import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly _fileService: FileService) {}

  @Post()
  async create(@Body() createFileDto: CreateFileDto) {
    return await this._fileService.create(createFileDto);
  }

  @Get()
  async findAll() {
    return await this._fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._fileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this._fileService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._fileService.remove(id);
  }
}
