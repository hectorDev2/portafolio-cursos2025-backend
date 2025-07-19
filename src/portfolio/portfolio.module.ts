import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaratulaModule } from './caratula/caratula.module';
import { FilosofiaModule } from './filosofia/filosofia.module';
import { CargaLectivaModule } from './cargalectiva/cargalectiva.module';
import { CursoModule } from './curso/curso.module';
import { CurriculumModule } from './curriculum/curriculum.module';

@Module({
  imports: [
    CaratulaModule,
    CurriculumModule,
    FilosofiaModule,
    CargaLectivaModule,
    CursoModule,
  ],
  providers: [PortfolioService, PrismaService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
