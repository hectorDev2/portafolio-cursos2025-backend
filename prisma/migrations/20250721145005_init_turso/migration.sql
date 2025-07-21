/*
  Warnings:

  - You are about to drop the `RegistroEntregaSílabo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cursoId]` on the table `AvanceCurso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cursoId]` on the table `silabo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RegistroEntregaSílabo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RegistroEntregaSilabo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursoId" TEXT NOT NULL,
    CONSTRAINT "RegistroEntregaSilabo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistroEntregaSilabo_cursoId_key" ON "RegistroEntregaSilabo"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvanceCurso_cursoId_key" ON "AvanceCurso"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "silabo_cursoId_key" ON "silabo"("cursoId");
