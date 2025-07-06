import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CargaLectivaController } from './cargalectiva.controller';
import { CargaLectivaService } from './cargalectiva.service';

@Module({
  imports: [PrismaModule],
  controllers: [CargaLectivaController],
  providers: [CargaLectivaService],
  exports: [CargaLectivaService],
})
export class CargaLectivaModule {}
