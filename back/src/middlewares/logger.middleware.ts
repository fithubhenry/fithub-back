import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, ip, originalUrl } = req;
    const actualDate = new Date();
    const date = actualDate.toLocaleDateString();
    const time = actualDate.toLocaleTimeString();
    console.log(
      `METODO: ${method} URL: ${originalUrl} [${date} - ${time}] IP: ${ip}`,
    );
    next();
  }
}
