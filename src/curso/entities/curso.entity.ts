import { Prisma } from '@prisma/client';

export class Curso implements Prisma.CursoUncheckedCreateInput {
  id?: string;
  name: string;
  code?: string | null;
  portfolioId: string;
}
