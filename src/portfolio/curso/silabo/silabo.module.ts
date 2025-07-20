import { Module } from '@nestjs/common';
import { SilaboService } from './silabo.service';
import { SilaboController } from './silabo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SilaboController],
  providers: [SilaboService],
})
export class SilaboModule {}
