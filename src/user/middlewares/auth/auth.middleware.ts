import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../../types/expressRequest.interface';
import { UserService } from '../../../user/user.service';
import { JWT_SECRET } from '../../../config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      req.user = await this.userService.getUserById(decode.id);
      // console.log('Auth Middle response' + JSON.stringify(req));
      next();
      return;
    } catch (err) {
      req.user = null;
      next();
      return;
    }
  }
}
