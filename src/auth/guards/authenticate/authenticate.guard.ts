import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../types/types.js';
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: JwtPayload
}

@Injectable()
export class AuthenticateGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const token = request.cookies?.access_token

    if (!token) {
      throw new UnauthorizedException('Access token is missing')
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      request.user = payload
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token')
    }
  }
}
