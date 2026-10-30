import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../authenticate/authenticate.guard.js';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const user = request?.user

    if (!user || user?.role !== 'ADMIN') {
      throw new UnauthorizedException(
        "You are not authorized to access this resource"
      )
    }

    return true
  }
}

