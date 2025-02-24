import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { USER_ROLE_CODE as ROLES } from '../enums/role.enum';
import { PostEntity } from 'src/post/entities/post.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ type: Number })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ type: String })
  @Length(3, 255, {
    message: '"Username" deve ter entre $constraint1 a $constraint2',
  })
  username: string;

  @Column()
  @ApiProperty({ type: String })
  @Exclude({ toPlainOnly: true })
  @Length(8, 255, {
    message: '"Senha" deve conter entre $constraint1 a $constraint2',
  })
  @IsStrongPassword(undefined, { message: '"Senha" não é forte suficiente' })
  password: string;

  @Column({ type: 'text' })
  @ApiProperty({ enum: ROLES, required: false })
  @IsEnum(ROLES)
  role: ROLES;

  @Column({ unique: true, nullable: true })
  @ApiProperty({
    type: String,
    description: 'Qualquer texto sera colocado minusculo',
  })
  @IsEmail({}, { message: '"$property" com formato invalido' })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  @IsOptional()
  email?: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  birthday?: Date;

  @OneToMany(() => PostEntity, (posts) => posts.user)
  @JoinTable({ name: 'post' })
  posts: Relation<PostEntity[]>;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;

  constructor(
    entity?: Partial<Omit<UserEntity, 'encryptPassword' | 'verifyPassword'>>,
  ) {
    if (entity) {
      Object.assign(this, entity);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  public verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
