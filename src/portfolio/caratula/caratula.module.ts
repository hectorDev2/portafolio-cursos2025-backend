import { Module } from '@nestjs/common';
import { CaratulaController } from './caratula.controller';
import { CaratulaService } from './caratula.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads/caratulas',
    }),
  ],
  controllers: [CaratulaController],
  providers: [CaratulaService],
  exports: [CaratulaService],
})
export class CaratulaModule {}
