import { Module } from '@nestjs/common';
import { RegistroEntregaSilaboService } from './registro-entrega-silabo.service';
import { RegistroEntregaSilaboController } from './registro-entrega-silabo.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegistroEntregaSilaboController],
  providers: [RegistroEntregaSilaboService],
})
export class RegistroEntregaSilaboModule {}