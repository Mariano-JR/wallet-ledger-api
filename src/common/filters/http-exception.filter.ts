import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../errors/app.error.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      return res.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        error: 'Erro na aplicação',
        message: exception.message,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      return res.status(status).json({
        statusCode: status,
        error: 'Erro na requisição',
        message: exception.message,
      });
    }

    console.error(exception);

    return res.status(500).json({
      statusCode: 500,
      error: 'Erro não esperado',
      message: 'Erro interno do servidor',
    });
  }
}
