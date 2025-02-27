import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
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
  UpdateDateColumn,
} from 'typeorm';
import { POST_TYPES as TYPES } from '../enums/type.enum';
import { STATUS_TYPES as STATUS } from '../enums/status.enum';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: String })
  id: string;

  @Column()
  @ApiProperty({ type: String })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ type: String, required: false })
  description: string;

  @Column()
  @ApiProperty({ type: String })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user' })
  @ApiProperty({ type: UserEntity })
  user: Relation<UserEntity>;

  @Column({ type: 'text', default: TYPES.POST })
  @ApiProperty({ enum: TYPES, required: false })
  @IsEnum(TYPES)
  @IsOptional()
  type: TYPES = TYPES.POST;

  @Column({ type: 'text', default: STATUS.DEACTIVATED })
  @ApiProperty({ enum: STATUS, required: false })
  @IsEnum(STATUS)
  @IsOptional()
  status: STATUS = STATUS.DEACTIVATED;

  @OneToOne(() => FileEntity, (file) => file.post, { nullable: true })
  @JoinColumn({ name: 'image' })
  @ApiProperty({ type: FileEntity, required: false })
  image: Relation<FileEntity>;

  @Column('int', { default: 0 })
  @ApiProperty({ type: Number })
  views: number = 0;

  @Column('int', { default: 0 })
  @ApiProperty({ type: Number })
  likes: number = 0;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  updatedAt: Date;

  constructor(entity?: Partial<PostEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }
}
