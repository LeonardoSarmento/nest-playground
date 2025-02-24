import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FileEntity } from '../../file/entities/file.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String })
  id: string;

  @Column()
  @ApiProperty({ type: String })
  title: string;

  @Column()
  @ApiProperty({ type: String })
  description: string;

  @Column()
  @ApiProperty({ type: String })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user' })
  @ApiProperty({ type: UserEntity })
  user: Relation<UserEntity>;

  @OneToOne(() => FileEntity, (file) => file.post)
  @JoinColumn({ name: 'image' })
  @ApiProperty({ type: FileEntity })
  image: Relation<FileEntity>;

  @Column('int')
  @ApiProperty({ type: Number })
  views: number;

  @Column('int')
  @ApiProperty({ type: Number })
  likes: number;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;
}
