import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PortfolioService, PrismaService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
