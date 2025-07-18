/*
  Warnings:

  - A unique constraint covering the columns `[portfolioId]` on the table `Caratula` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[portfolioId]` on the table `CargaLectiva` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[portfolioId]` on the table `Curriculum` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[portfolioId]` on the table `Filosofía` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Caratula_portfolioId_key" ON "Caratula"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "CargaLectiva_portfolioId_key" ON "CargaLectiva"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_portfolioId_key" ON "Curriculum"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "Filosofía_portfolioId_key" ON "Filosofía"("portfolioId");
