// src/auth/guards/jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // Import your @Public() decorator key

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if the route is marked as public using @Public() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Check method decorator
      context.getClass(), // Check controller class decorator
    ]);

    if (isPublic) {
      return true; // If public, allow access without authentication
    }

    // If not public, proceed with JWT authentication provided by Passport
    return super.canActivate(context);
  }

  // Optional: Handle authentication failures
  handleRequest(err, user, info) {
    if (err || !user) {
      // You can log info or err here for debugging
      console.log(
        'Authentication failed:',
        info?.message || err?.message || 'Unknown error',
      );
      throw (
        err ||
        new UnauthorizedException(
          `Authentication failed: ${info?.message || 'Invalid token'}`,
        )
      );
    }
    return user; // Return the user if authenticated
  }
}
