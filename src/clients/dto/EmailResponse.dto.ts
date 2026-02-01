import { EmailErrorResponseDto } from './EmailErrorResponse.dto';

export class EmailResponseSuccess<T> {
  data: T;
  error: null;
}

export class EmailResponseError {
  error: EmailErrorResponseDto;
  data: null;
}
