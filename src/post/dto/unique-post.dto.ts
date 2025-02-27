import { PartialType, PickType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class PostUniquesDto extends PartialType(PickType(PostEntity, ['id'])) {}
