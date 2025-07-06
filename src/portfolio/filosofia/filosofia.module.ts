import { Module } from '@nestjs/common';
import { FilosofiaController } from './filosofia.controller';
import { FilosofiaService } from './filosofia.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FilosofiaController],
  providers: [FilosofiaService],
  exports: [FilosofiaService],
})
export class FilosofiaModule {}
