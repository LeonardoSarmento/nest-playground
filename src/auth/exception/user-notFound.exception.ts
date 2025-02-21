import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Usuário não encontrado', HttpStatus.FORBIDDEN);
  }
}
