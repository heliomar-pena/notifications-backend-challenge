import { HttpException, HttpStatus } from '@nestjs/common';
import { EmailErrorResponseDto } from './dto/EmailErrorResponse.dto';

export class EmailClientError extends HttpException {
  constructor(error: EmailErrorResponseDto) {
    super(error.message, error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
