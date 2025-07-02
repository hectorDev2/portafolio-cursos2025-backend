import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PortafolioDeCursosModule } from './portafolio-de-cursos/portafolio-de-cursos.module';
import { SilaboModule } from './silabo/silabo.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Directory where files will be stored
    }),
    UserModule,
    AuthModule,
    PortafolioDeCursosModule,
    SilaboModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // This token registers a global guard
      useClass: JwtAuthGuard, // Use your custom JWT Guard
    },
  ],
})
export class AppModule {}
