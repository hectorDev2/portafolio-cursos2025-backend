// src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * @class PrismaService
 * @description Servicio que encapsula la instancia de PrismaClient.
 * Implementa OnModuleInit para conectar la base de datos al iniciar el módulo
 * y onModuleDestroy para desconectarla al cerrar la aplicación.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Conecta PrismaClient a la base de datos cuando el módulo se inicializa.
    await this.$connect();
  }

  async onModuleDestroy() {
    // Desconecta PrismaClient de la base de datos cuando la aplicación se cierra.
    await this.$disconnect();
  }

  /**
   * @method enableShutdownHooks
   * @description Habilita los hooks de apagado para asegurar que PrismaClient se desconecte
   * limpiamente cuando la aplicación NestJS se apaga.
   * @param {INestApplication} app - La instancia de la aplicación NestJS.
   */
  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
