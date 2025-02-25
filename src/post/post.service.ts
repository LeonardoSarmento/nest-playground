import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCreateDto } from './dto/create-post.dto';
import { PostUpdateDto } from './dto/update-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserNotFoundException } from 'src/auth/exception/user-notFound.exception';
import { PostRepository } from './post.repository';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly repository: PostRepository,
    private readonly _userService: UserService,
  ) {}
  async create(createPostDto: PostCreateDto, creatorId: UserEntity['id']) {
    const user = await this._userService.findByUnique({ id: creatorId });
    if (!user) throw new UserNotFoundException();

    createPostDto.user = user;

    const post = createPostDto.toEntity();

    return this.repository.create(post);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: PostEntity['id']) {
    const post = await this.repository.findOne(id);
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async update(id: PostEntity['id'], updatePostDto: PostUpdateDto) {
    const updatedPost = await this.repository.update(id, updatePostDto);
    if (!updatedPost) throw new NotFoundException('Post não encontrado');
    return updatedPost;
  }

  async remove(id: PostEntity['id']) {
    const post = await this.repository.remove(id);
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }
}
