// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: Makes PrismaService globally available without importing PrismaModule in every feature module
@Module({
  providers: [PrismaService], // Provide PrismaService within this module
  exports: [PrismaService], // Export PrismaService so other modules can use it
})
export class PrismaModule {}
