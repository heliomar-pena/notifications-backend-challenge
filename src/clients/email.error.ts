import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'resend';

export class EmailClientError extends HttpException {
  constructor(error: ErrorResponse) {
    super(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
