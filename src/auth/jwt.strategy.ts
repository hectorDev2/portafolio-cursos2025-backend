// 3. Estrategia JWT de Passport (ej. src/auth/jwt.strategy.ts)
// ********************************************************************************
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

// Define la interfaz para el payload del JWT
export interface JwtPayload {
  sub: string; // ID del usuario (subject)
  email: string; // Email del usuario
  role: string; // Rol del usuario
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
    // Aquí puedes buscar el usuario en la DB para asegurarte de que existe y está activo,
    // o para añadir más información al objeto de usuario en la solicitud (req.user).
    // Por simplicidad, devolveremos el payload directamente.
    // console.log('Payload validado:', payload);
    const user = await this.userService.getUserById(payload.sub); // Asume que payload.sub es el ID
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.'); // O UnauthorizedException
    }
    // Puedes devolver el objeto de usuario completo si lo necesitas en el req.user
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      name: user.name,
    };
  }
}
