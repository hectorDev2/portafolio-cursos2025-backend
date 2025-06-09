import { Module } from '@nestjs/common';
import { PortafolioDeCursosService } from './portafolio-de-cursos.service';
import { PortafolioDeCursosController } from './portafolio-de-cursos.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PortafolioDeCursosService, PrismaService],
  controllers: [PortafolioDeCursosController],
})
export class PortafolioDeCursosModule {}
