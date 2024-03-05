/*
  Warnings:

  - A unique constraint covering the columns `[horarios]` on the table `modalidades` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "modalidades" ADD COLUMN     "horarios" TIMESTAMP(3)[],
ALTER COLUMN "periodo" SET DEFAULT 'MANHA';

-- CreateIndex
CREATE UNIQUE INDEX "modalidades_horarios_key" ON "modalidades"("horarios");
