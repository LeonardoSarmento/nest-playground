import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostUpdateDto } from './dto/update-post.dto';
import { PostCreateDto } from './dto/create-post.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { PostUniquesDto } from './dto/unique-post.dto';
import { UserUniquesDto } from 'src/user/dto/unique-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly _authService: AuthService,
  ) {}

  @Post()
  @ApiOkResponse({ type: PostEntity })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 10 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: PostCreateDto,
    @TokenPayloadParam() token: string,
  ) {
    if (!token) throw new UnauthorizedException('Autorização não encontrada');
    const { userId } = await this._authService.verifyTokenPayload(token);
    return this.postService.create(createPostDto, userId);
  }

  @Get('/all')
  @ApiOkResponse({ type: PostEntity, isArray: true })
  findAll() {
    return this.postService.findAll();
  }

  @Get('/list')
  @ApiOkResponse({ type: PostEntity, isArray: true })
  ListAll(
    @Query() uniques: PostUniquesDto,
    @Query() userUniques: UserUniquesDto,
  ) {
    return this.postService.findByUnique(uniques, userUniques);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: PostEntity })
  update(@Param('id') id: string, @Body() updatePostDto: PostUpdateDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: PostEntity })
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
