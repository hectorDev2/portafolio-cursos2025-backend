import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaratulaModule } from './caratula/caratula.module';
import { FilosofiaModule } from './filosofia/filosofia.module';
import { CargaLectivaModule } from './cargalectiva/cargalectiva.module';

@Module({
  imports: [CaratulaModule, FilosofiaModule, CargaLectivaModule],
  providers: [PortfolioService, PrismaService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
