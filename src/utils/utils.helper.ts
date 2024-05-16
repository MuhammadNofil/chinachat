import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

// http error handling helper
export const httpErrorHandlingFn = (
  err: any,
): {
  error: { status: 'fail'; message: { error: string[] } };
  httpStatusCode: number;
} => {
  console.log(err);
  let error: any = {};

  let httpStatusCode: number = 400;
  if ('BadRequestException' == err.name) {
    error = { status: 'fail', message: { error: [err.message] } };
    httpStatusCode = HttpStatus.BAD_REQUEST;
  } else if ('NotFoundException' == err.name) {
    error = { status: 'fail', message: { error: [err.message] } };
    httpStatusCode = HttpStatus.NOT_FOUND;
  } else if (err.statusCode == 401) {
    error = { status: 'fail', message: { error: [err.message] } };
    httpStatusCode = HttpStatus.UNAUTHORIZED;
  } else {
    error = {
      status: 'fail',
      message: {
        error: Array.isArray(err?.message) ? err?.message : [err?.message],
      },
    };
    httpStatusCode = err.status || HttpStatus.BAD_REQUEST;
  }

  return { error, httpStatusCode };
};

// mongoose error handling helper
const normalWord = (word?: string) =>
  word.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, '$1');

const handleCastErrorDb = (err: any) => [`Invalid ${err.path} : ${err.name}`];

const handleDuplicateFieldsDb = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = Object.keys(err?.keyValue).map(
    (e) =>
      `Duplicate field ${normalWord(e) || 'value'} : ${value}.Please use another ${normalWord(e) || 'value'}`,
  );

  return message;
};
const handleValidationErrorDb = (err: any) => {
  const errors = Object.values(err.errors).map(
    (ele: any) => `Invalid Input ${ele?.message}`,
  );

  return errors;
};
export const mongoErrorHandlingFn = (
  err: any,
): {
  error: { status: 'fail'; message: { error: string[] } };
  httpStatusCode: number;
} => {
  console.log(err);
  let error: any = {};

  let httpStatusCode: number = 400;
  if (err.code == 11000) {
    error = {
      status: 'fail',
      message: { error: handleDuplicateFieldsDb(err) },
    };
    httpStatusCode = HttpStatus.CONFLICT;
  } else if (err.name == 'ValidationError') {
    error = {
      status: 'fail',
      message: { error: handleValidationErrorDb(err) },
    };
    httpStatusCode = HttpStatus.BAD_REQUEST;
  } else if (err.name == 'CastError') {
    error = { status: 'fail', message: { error: handleCastErrorDb(err) } };
    httpStatusCode = HttpStatus.NOT_FOUND;
  } else {
    error = {
      status: 'fail',
      message: {
        error: Array.isArray(err?.message) ? err?.message : [err?.message],
      },
    };
    httpStatusCode = err.status || HttpStatus.BAD_REQUEST;
  }

  return { error, httpStatusCode };
};

// guard helper
export const matchRoles = (roles: string[], userRoles: string[]) =>
  roles.some((role) => userRoles.includes(role));

export const matchPermissions = (
  roles: string[] = [],
  userRoles: string[] = [],
) => roles.some((role) => userRoles.includes(role));

// uploads helper
export const manageNewAttachment = (
  oldAttach: string[] = [],
  newAttach: string[] = [],
  deletableAttach: string[] = [],
): string[] => {
  const uniqueNewAttach = [...new Set(oldAttach.concat(newAttach))];
  return uniqueNewAttach.filter((el) => !deletableAttach.includes(el));
};

// Otp generator
export const generateSixDigitRandomNumber = () => {
  const min = 100000; // Minimum value for a 6-digit number
  const max = 999999; // Maximum value for a 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// logout helper
export const validateToken = (user: any, request: Request) => {
  const token = request.headers['authorization'].split(' ')[1];
  if (user.blackListToken.includes(token.toString())) {
    throw new UnauthorizedException('Unauthorized');
  }
};
