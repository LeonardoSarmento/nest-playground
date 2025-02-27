import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCreateDto } from './dto/create-post.dto';
import { PostUpdateDto } from './dto/update-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserNotFoundException } from 'src/auth/exception/user-notFound.exception';
import { PostRepository } from './post.repository';
import { PostEntity } from './entities/post.entity';
import { PostUniquesDto } from './dto/unique-post.dto';
import { UserUniquesDto } from 'src/user/dto/unique-user.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly repository: PostRepository,
    private readonly _userService: UserService,
  ) {}
  async create(createPostDto: PostCreateDto, creatorId: UserEntity['id']) {
    let userId: UserEntity['id'];
    if (!createPostDto.userId) {
      userId = creatorId;
    } else {
      userId = createPostDto.userId;
    }
    const user = await this._userService.findByUnique({ id: userId });
    if (!user) throw new UserNotFoundException();

    const post = createPostDto.toEntity(undefined, user);

    return this.repository.create(post);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByUnique(uniques: PostUniquesDto, userUniques: UserUniquesDto) {
    return this.repository.findByUnique(uniques, userUniques);
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
