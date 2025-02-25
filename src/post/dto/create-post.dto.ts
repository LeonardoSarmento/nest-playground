import { OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class PostCreateDto extends OmitType(PostEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'views',
  'likes',
]) {
  constructor(dto?: PostCreateDtoType) {
    super();
    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(existingPost?: PostEntity): PostEntity {
    if (existingPost) {
      Object.assign(existingPost, this);
      existingPost.updatedAt = new Date();
      return existingPost;
    }
    return new PostEntity(this);
  }
}

export type PostCreateDtoType = {
  title: string;
  description?: string;
  content: string;
  user: PostEntity['user'];
  image?: PostEntity['image'];
  type?: PostEntity['type'];
  status?: PostEntity['status'];
};
