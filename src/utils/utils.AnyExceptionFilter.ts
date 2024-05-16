import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { httpErrorHandlingFn, mongoErrorHandlingFn } from './utils.helper';
import { Response } from 'express';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error: { status: string; message: { error: string[] } } = null;
    let httpStatusCode: number = null;

    if (exception instanceof HttpException) {
      console.log('httpException');
      const errors = exception.getResponse();
      const rs = httpErrorHandlingFn(errors);
      error = rs.error;
      httpStatusCode = rs.httpStatusCode;
    } else if (
      ['MongoServerError', 'ValidationError', 'CastError'].includes(
        exception?.constructor?.name,
      )
    ) {
      console.log('MongoError');
      const rs = mongoErrorHandlingFn(exception);
      error = rs.error;
      httpStatusCode = rs.httpStatusCode;
    } else {
      (error = { status: 'error', message: { error: [exception.message] } }),
        (httpStatusCode = 500);
    }
    response
      .status(httpStatusCode)
      .json({ ...error, statusCode: httpStatusCode });
  }
}
