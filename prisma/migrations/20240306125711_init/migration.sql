/*
  Warnings:

  - A unique constraint covering the columns `[modName]` on the table `horarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "horarios_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "horarios_modName_key" ON "horarios"("modName");
