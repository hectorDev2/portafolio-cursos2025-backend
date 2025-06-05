import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Instancia de Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding de usuarios...');

  // 1. Contraseña en texto plano para el usuario de ejemplo
  const password = 'password123';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 2. Crea un usuario de ejemplo
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' }, // Busca por email para evitar duplicados en cada seed
    update: {
      // Si el usuario existe, actualiza estos campos
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMINISTRADOR', // Asigna un rol de administrador
    },
    create: {
      // Si el usuario NO existe, crea uno nuevo con estos campos
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMINISTRADOR', // Asigna un rol de administrador
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password: hashedPassword, // Puedes usar la misma contraseña hasheada o una diferente
      name: 'Normal User',
      role: 'DOCENTE', // Cambiado a 'DOCENTE'
    },
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Normal User',
      role: 'DOCENTE',
    },
  });

  console.log({ adminUser, normalUser });
  console.log('Seeding de usuarios completado.');
}

// Ejecuta la función principal y cierra la conexión de Prisma
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
