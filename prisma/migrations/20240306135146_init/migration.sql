/*
  Warnings:

  - A unique constraint covering the columns `[modName]` on the table `localidades` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modName` to the `localidades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "localidades" ADD COLUMN     "modName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "localidades_modName_key" ON "localidades"("modName");

-- AddForeignKey
ALTER TABLE "localidades" ADD CONSTRAINT "localidades_modName_fkey" FOREIGN KEY ("modName") REFERENCES "modalidades"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
