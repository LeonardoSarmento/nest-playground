import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserUniquesDto } from './dto/unique-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { USER_ROLE_CODE as ROLES } from '../user/enums/role.enum';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  @ApiOkResponse({ type: UserEntity })
  @Roles([ROLES.ADMIN])
  async create(@Body() createUserDto: UserCreateDto) {
    return await this._userService.create(createUserDto);
  }

  @Get(['all'])
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    return await this._userService.findAll();
  }

  @Get(['unique'])
  @ApiOkResponse({ type: UserEntity })
  async uniqueUser(@Query() uniques: UserUniquesDto) {
    return await this._userService.findByUnique(uniques);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    return await this._userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return await this._userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this._userService.remove(+id);
  }
}
