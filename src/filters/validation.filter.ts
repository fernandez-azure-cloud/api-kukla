import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ValidationFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json({
      errors: exception.errors,
      message: exception.message,
      statusCode: status,
    });
  }
}
