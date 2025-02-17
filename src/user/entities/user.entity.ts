import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  Length,
} from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { USER_ROLE_CODE as ROLES } from '../enums/role.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
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
  @Length(8, 255, {
    message: '"Senha" deve conter entre $constraint1 a $constraint2',
  })
  @IsStrongPassword(undefined, { message: '"Senha" não é forte suficiente' })
  password: string;

  @Column()
  @ApiProperty({ name: 'role', enum: ROLES, required: false })
  @IsEnum(ROLES)
  role: ROLES;

  @Column({ unique: true })
  @ApiProperty({
    type: String,
    description: 'Qualquer texto sera colocado minusculo',
  })
  @IsEmail({}, { message: '"$property" com formato invalido' })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsOptional()
  email?: string;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  birthday?: Date;

  @CreateDateColumn()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Column()
  @ApiProperty({ type: Date, required: false })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;

  // constructor(entity?: UserEntity | UserCreateDto | UserUpdateDto | any) {
  //   // console.debug(entity)
  //   if (entity) {
  //     this.id = entity.id;
  //     this.email = entity.email;
  //     this.username = entity.username;
  //     this.birthday = entity.birthday;
  //     this.createdAt = entity.createdAt;
  //   }
  // }

  @BeforeInsert()
  encryptPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  public verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
