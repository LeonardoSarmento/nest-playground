import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongPasswordException extends HttpException {
  constructor() {
    super('Senha inválida', HttpStatus.FORBIDDEN);
  }
}
