// src/auth/jwt.strategy.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service'; // Adjust path if necessary

// Define la interfaz para el payload del JWT
export interface JwtPayload {
  sub: string; // ID del usuario (subject)
  email: string; // Email del usuario
  role: string; // Rol del usuario
  // IMPORTANT: The 'name' field is used in the payload when generating the token
  // in auth.service.ts, but not explicitly defined here in JwtPayload.
  // This won't cause a direct error but can lead to type safety issues.
  // It's better to align JwtPayload interface with what's actually in the token.
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del encabezado 'Authorization: Bearer <token>'
      ignoreExpiration: false, // No ignorar la expiración del token
      secretOrKey: secret, // El secreto para verificar el token
    });
  }

  // Este método se ejecuta una vez que el token ha sido validado y decodificado.
  // El 'payload' es el objeto JSON decodificado del JWT.
  async validate(payload: JwtPayload) {
    // console.log('Payload validado:', payload);

    // IMPORTANT: Payload 'sub' is typically a number (user ID), but defined as string here.
    // Ensure consistency with your user ID type in the database and UserService.
    // If your user IDs are numbers (e.g., Prisma's default `Int`), you should cast `payload.sub` to a number.
    const user = await this.userService.getUserById(payload.sub); // Asume que payload.sub es el ID
    if (!user) {
      // It's generally better to throw UnauthorizedException here,
      // as a NotFoundException might suggest a database error rather than
      // an authentication failure for a valid token.
      throw new NotFoundException('Usuario no encontrado.'); // O UnauthorizedException
    }

    // You can devolver el objeto de usuario completo si lo necesitas en el req.user
    // This return value will be attached to `req.user` by Passport.
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: user.name, // Accessing user.name from the found user object
    };
  }
}
