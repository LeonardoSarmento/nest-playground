import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PostEntity } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String })
  id: string;

  @Column()
  @ApiProperty({ type: String })
  name: string;

  @Column()
  @ApiProperty({ type: String })
  extension: string;

  @Column({ name: 'mime_type' })
  @ApiProperty({ type: String })
  mimeType: string;

  @OneToOne(() => PostEntity, (post) => post.image, { nullable: true })
  @ApiProperty({ type: PostEntity })
  post: Relation<PostEntity>;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  updatedAt: Date;

  constructor(entity?: Partial<FileEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
