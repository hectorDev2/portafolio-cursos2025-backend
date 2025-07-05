import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CursoModule } from './curso/curso.module';
import { PrismaModule } from './prisma/prisma.module';
import { CaratulaModule } from './portfolio/caratula/caratula.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PortfolioModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CursoModule,
    CaratulaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
