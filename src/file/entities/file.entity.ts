import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PostEntity } from 'src/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'file' })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String })
  id: string;

  @Column()
  @ApiProperty({ type: String })
  name: string;

  @OneToOne(() => PostEntity, (post) => post.image)
  @JoinColumn({ name: 'post' })
  post: PostEntity;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;
}
