import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PortafolioDeCursosModule } from './portafolio-de-cursos/portafolio-de-cursos.module';
import { SilaboModule } from './silabo/silabo.module';
import { ServeStaticModule } from '@nestjs/serve-static'; // <--- IMPORT ServeStaticModule
import { join } from 'path'; // <--- IMPORT 'join'

@Module({
  imports: [
    UserModule,
    AuthModule,
    PortafolioDeCursosModule,
    SilaboModule,
    // --- STATIC FILES CONFIGURATION ---
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your uploads folder
      serveRoot: '/uploads', // The URL prefix to access static files (e.g., http://localhost:3000/uploads/...)
      // You might want to serve other subfolders differently, but this covers /uploads/silabos
    }),
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
