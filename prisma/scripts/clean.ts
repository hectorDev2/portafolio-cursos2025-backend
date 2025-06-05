// prisma/clean.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanUsers() {
  console.log('Iniciando la limpieza de usuarios existentes...');
  try {
    // Elimina todos los registros de la tabla User
    // ¡MUCHO CUIDADO CON ESTO EN ENTORNOS DE PRODUCCIÓN!
    await prisma.user.deleteMany();
    console.log('Todos los usuarios existentes han sido eliminados.');
  } catch (error) {
    console.error('Error al limpiar usuarios:', error);
    process.exit(1); // Sale con error si la limpieza falla
  } finally {
    await prisma.$disconnect(); // Desconecta Prisma al finalizar
  }
}

// Ejecuta la función principal
cleanUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
