import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const formatErrors = (errors: ValidationError[]) =>
  errors.map((error) => {
    const constraints = error.constraints;
    if (constraints) {
      return Object.values(constraints).join(', ');
    }
    return '';
  });

export class CustomClassValidationError extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        error: 'Bad Request',
        message: formatErrors(errors),
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
