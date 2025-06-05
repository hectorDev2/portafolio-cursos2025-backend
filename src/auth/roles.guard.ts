import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './jwt.strategy'; // Importa la interfaz del payload
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos del decorador @Roles() en la ruta
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no hay roles definidos, la ruta es pública
    }

    // Obtiene el objeto de solicitud y el usuario autenticado
    const { user } = context.switchToHttp().getRequest();

    // El 'user' en este punto es el objeto retornado por el método 'validate' de JwtStrategy.
    // Asumimos que tiene una propiedad 'role'.
    const userRole = (user as JwtPayload).role; // Castear a JwtPayload para acceder a 'role'

    // Verifica si el rol del usuario está incluido en los roles requeridos
    return requiredRoles.includes(userRole);
  }
}
