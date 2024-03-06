/*
  Warnings:

  - You are about to drop the column `modName` on the `horarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[time]` on the table `horarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "horarios" DROP CONSTRAINT "horarios_modName_fkey";

-- DropIndex
DROP INDEX "horarios_modName_key";

-- AlterTable
ALTER TABLE "horarios" DROP COLUMN "modName",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "horarios_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_horario_modalidade" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_horario_modalidade_AB_unique" ON "_horario_modalidade"("A", "B");

-- CreateIndex
CREATE INDEX "_horario_modalidade_B_index" ON "_horario_modalidade"("B");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_time_key" ON "horarios"("time");

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_A_fkey" FOREIGN KEY ("A") REFERENCES "horarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_B_fkey" FOREIGN KEY ("B") REFERENCES "modalidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
