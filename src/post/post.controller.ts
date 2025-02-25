import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostUpdateDto } from './dto/update-post.dto';
import { PostCreateDto } from './dto/create-post.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly _authService: AuthService,
  ) {}

  @Post()
  @ApiOkResponse({ type: PostEntity })
  async create(
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
  ListAll() {
    return this.postService.findAll();
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
