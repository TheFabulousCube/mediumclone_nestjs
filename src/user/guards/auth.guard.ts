import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequest } from '../../types/expressRequest.interface';
import { error_messages } from '../../utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const auth = request.body;
    if (request.user) {
      return true;
    } else {
      throw new HttpException(
        error_messages.UNAUTHORIZED_REQUEST,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
