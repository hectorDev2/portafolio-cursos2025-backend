import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AvanceCursoModule } from './avance-curso/avance-curso.module';
import { RegistroEntregaSilaboModule } from './registro-entrega-silabo/registro-entrega-silabo.module';
import { SilaboModule } from './silabo/silabo.module';

@Module({
  imports: [
    PrismaModule,
    AvanceCursoModule,
    RegistroEntregaSilaboModule,
    SilaboModule,
  ],
  providers: [CursoService],
  controllers: [CursoController],
})
export class CursoModule {}
