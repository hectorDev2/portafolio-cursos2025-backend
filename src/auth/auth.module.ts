import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule, // Módulo base de Passport
    JwtModule.register({
      // Configura JwtModule
      secret: process.env.SECRET, // Secreto para firmar tokens
      signOptions: { expiresIn: '60m' }, // Opciones de firma (ej. expiración)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
