import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { IsOptional } from 'class-validator';

export class PostCreateDto extends OmitType(PostEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'views',
  'likes',
  'user',
]) {
  @ApiProperty({ type: Number })
  @IsOptional()
  userId: UserEntity['id'];

  constructor(dto?: PostCreateDtoType) {
    super();
    if (dto) {
      Object.assign(this, dto);
    }
  }

  public toEntity(existingPost?: PostEntity, user?: UserEntity): PostEntity {
    if (existingPost) {
      Object.assign(existingPost, this);
      existingPost.updatedAt = new Date();
      return existingPost;
    }
    return new PostEntity({
      ...this,
      user,
    });
  }
}

export type PostCreateDtoType = {
  title: string;
  description?: string;
  content: string;
  userid: UserEntity['id'];
  image?: PostEntity['image'];
  type?: PostEntity['type'];
  status?: PostEntity['status'];
};
