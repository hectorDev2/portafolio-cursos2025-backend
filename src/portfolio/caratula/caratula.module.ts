import { Module } from '@nestjs/common';
import { CaratulaController } from './caratula.controller';
import { CaratulaService } from './caratula.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CaratulaController],
  providers: [CaratulaService],
  exports: [CaratulaService],
})
export class CaratulaModule {}
