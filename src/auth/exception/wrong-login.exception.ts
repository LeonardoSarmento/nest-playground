import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongUserLoginException extends HttpException {
  constructor() {
    super('Usuário ou senha incorretos!', HttpStatus.FORBIDDEN);
  }
}
