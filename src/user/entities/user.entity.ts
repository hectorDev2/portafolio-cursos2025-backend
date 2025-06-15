// Importa el enum Role de Prisma Client, ya que es parte de la definición de tu entidad.

import { Role } from 'src/enum/role';

/**
 * @interface IUser
 * @description Define la estructura de la entidad User, reflejando el modelo Prisma.
 * Esta interfaz es útil para tipado y para desacoplar el dominio de Prisma Client
 * si es necesario, aunque Prisma ya genera sus propios tipos.
 */
export interface IUser {
  id: string;
  email: string;
  password: string; // Nota: En la aplicación, esta debería ser la contraseña hasheada.
  name?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  // Las relaciones (portfolios, feedbacks) también podrían incluirse si se cargan.
  // Por ejemplo:
  // portfolios?: Portfolio[];
  // feedbacks?: Feedback[];
}

/**
 * @class UserEntity
 * @description Una clase que representa la entidad User.
 * Puedes usar esta clase para instanciar objetos User y añadir métodos de negocio.
 * A menudo, en aplicaciones con Prisma, se trabaja directamente con los tipos generados
 * por Prisma (ej. `Prisma.UserGetPayload<...>` o simplemente `User` si usas `select` o `include`).
 * Esta clase es más común en arquitecturas donde se quiere una capa de dominio más explícita.
 */
export class UserEntity implements IUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Puedes añadir métodos de negocio aquí, por ejemplo:
  // public updateName(newName: string): void {
  //   this.name = newName;
  //   this.updatedAt = new Date();
  // }

  // public isAdmin(): boolean {
  //   return this.role === Role.ADMINISTRADOR;
  // }
}

// Ejemplo de cómo Prisma genera un tipo para tu modelo User:
// import { User as PrismaUserType } from '@prisma/client';
// const prismaUser: PrismaUserType = { /* ... */ };

// En la práctica, a menudo usarás directamente los tipos generados por Prisma Client,
// que son muy convenientes y reflejan exactamente la estructura de tu base de datos.
// Por ejemplo, cuando haces una consulta:
// const user = await prisma.user.findUnique({ where: { id: 'some-id' } });
// El tipo de 'user' ya sería el tipo generado por Prisma para User.
