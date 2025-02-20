import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserUniquesDto } from './dto/unique-user.dto';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayloadDto } from 'src/auth/dto/jwt.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { USER_ROLE_CODE as ROLES } from 'src/user/enums/role.enum';
import { tokenName } from 'src/auth/configuration/constants.configuration';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _authService: AuthService,
  ) {}

  @Post()
  @ApiOkResponse({ type: UserEntity })
  async create(@Body() createUserDto: UserCreateDto, @Req() req: Request) {
    const jwt = req.cookies[tokenName] as string;
    let userRequesting: JwtPayloadDto | undefined;
    if (jwt) {
      userRequesting = await this._authService.verifyTokenPayload(jwt);
    }
    return await this._userService.create(createUserDto, userRequesting);
  }

  @Get(['all'])
  @Roles([ROLES.ADMIN])
  @ApiOkResponse({ type: [UserEntity] })
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
