import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule, // Módulo base de Passport
    JwtModule.register({
      // Configura JwtModule
      secret: process.env.JWT_SECRET, // Secreto para firmar tokens
      signOptions: { expiresIn: '60m' }, // Opciones de firma (ej. expiración)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
})
export class AuthModule {}
