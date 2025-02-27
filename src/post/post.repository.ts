import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostUpdateDto } from './dto/update-post.dto';
import { PostUniquesDto } from './dto/unique-post.dto';
import { UserUniquesDto } from 'src/user/dto/unique-user.dto';

@Injectable()
export class PostRepository {
  constructor(
    @Inject('POST_REPOSITORY')
    private readonly _repository: Repository<PostEntity>,
  ) {}

  public async create(post: PostEntity): Promise<PostEntity> {
    return this._repository.save(post);
  }

  public async findAll(): Promise<PostEntity[]> {
    return this._repository.find();
  }

  public async findByUnique(
    uniques: PostUniquesDto,
    userUniques: UserUniquesDto,
  ): Promise<PostEntity[] | null> {
    return await this._repository.find({
      where: [
        { id: uniques.id },
        {
          user: [
            { id: userUniques.id },
            { username: userUniques.username },
            { email: userUniques.email },
          ],
        },
      ],
      // relations: { user: true },
    });
  }

  private async getById(id: PostEntity['id']): Promise<PostEntity | null> {
    return this._repository.findOne({ where: { id } });
  }

  public async findOne(id: PostEntity['id']): Promise<PostEntity | null> {
    return this.getById(id);
  }

  public async update(
    id: PostEntity['id'],
    post: PostUpdateDto,
  ): Promise<PostEntity | null> {
    const existingUser = await this.getById(id);
    if (!existingUser) return null;

    await this._repository.update(id, post);
    return this.getById(id);
  }

  public async remove(id: PostEntity['id']): Promise<PostEntity | null> {
    const post = await this.getById(id);
    if (!post) return null;

    await this._repository.delete(id);
    return post;
  }
}
