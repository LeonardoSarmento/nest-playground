import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PostEntity } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String })
  id: string;

  @Column()
  @ApiProperty({ type: String })
  name: string;

  @OneToOne(() => PostEntity, (post) => post.image)
  @ApiProperty({ type: PostEntity })
  post: Relation<PostEntity>;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;
}
