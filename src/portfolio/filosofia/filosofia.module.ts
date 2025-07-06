import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FilosofiaController } from './filosofia.controller';
import { FilosofiaService } from './filosofia.service';

@Module({
  imports: [PrismaModule],
  controllers: [FilosofiaController],
  providers: [FilosofiaService],
  exports: [FilosofiaService],
})
export class FilosofiaModule {}
