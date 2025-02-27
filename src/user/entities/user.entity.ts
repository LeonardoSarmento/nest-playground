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
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { USER_ROLE_CODE as ROLES } from '../enums/role.enum';
import { PostEntity } from '../../post/entities/post.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    type: Number,
    description: 'Identificador de Usuário',
  })
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

  @Column({ type: 'text', default: ROLES.USER })
  @ApiProperty({ enum: ROLES, required: false })
  @IsEnum(ROLES)
  @IsOptional()
  role: ROLES = ROLES.USER;

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
  @ApiProperty({ type: Array<PostEntity> })
  posts: Relation<PostEntity[]>;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  updatedAt: Date;

  constructor(entity?: Partial<UserEntity>) {
    if (entity) {
      Object.assign(this, entity);
    }
  }

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async updatePassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
