import { Module } from '@nestjs/common';
import { PortafolioDeCursosService } from './portafolio-de-cursos.service';
import { PortafolioDeCursosController } from './portafolio-de-cursos.controller';

@Module({
  providers: [PortafolioDeCursosService],
  controllers: [PortafolioDeCursosController],
})
export class PortafolioDeCursosModule {}
