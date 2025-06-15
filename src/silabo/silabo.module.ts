// src/silabo/silabo.module.ts
import { Module } from '@nestjs/common';
import { SilaboService } from './silabo.service';
import { SilaboController } from './silabo.controller';
// import { PrismaService } from 'src/prisma/prisma.service'; // This line is not needed here
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Import PrismaModule to make PrismaService available to SilaboService
    CloudinaryModule, // Import CloudinaryModule to make CloudinaryService available to SilaboController
  ],
  providers: [
    SilaboService,
    // PrismaService should be provided by PrismaModule, not directly here
    // CloudinaryModule is a module, not a provider.
  ],
  controllers: [SilaboController],
  exports: [SilaboService], // Good practice to export if other modules might need SilaboService
})
export class SilaboModule {}
