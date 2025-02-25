import { PartialType } from '@nestjs/swagger';
import { PostCreateDto } from './create-post.dto';

export class PostUpdateDto extends PartialType(PostCreateDto) {
  constructor(dto?: PostUpdateDto) {
    super();
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
