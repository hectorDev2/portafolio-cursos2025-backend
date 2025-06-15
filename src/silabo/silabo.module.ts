import { Module } from '@nestjs/common';
import { SilaboService } from './silabo.service';
import { SilaboController } from './silabo.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SilaboService, PrismaService],
  controllers: [SilaboController],
})
export class SilaboModule {}
