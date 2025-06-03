import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AppService');
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Prisma Client connected successfully');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
