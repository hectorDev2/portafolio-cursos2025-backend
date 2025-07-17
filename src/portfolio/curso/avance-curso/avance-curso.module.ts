import { Module } from '@nestjs/common';
import { AvanceCursoService } from './avance-curso.service';
import { AvanceCursoController } from './avance-curso.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvanceCursoController],
  providers: [AvanceCursoService],
})
export class AvanceCursoModule {}
