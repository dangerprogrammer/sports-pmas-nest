/*
  Warnings:

  - You are about to drop the column `modName` on the `localidades` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[endereco,bairro]` on the table `localidades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endereco,bairro]` on the table `modalidades` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "localidades" DROP CONSTRAINT "localidades_modName_fkey";

-- DropIndex
DROP INDEX "localidades_modName_key";

-- AlterTable
ALTER TABLE "localidades" DROP COLUMN "modName";

-- AlterTable
ALTER TABLE "modalidades" ADD COLUMN     "bairro" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "endereco" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_bairro_key" ON "localidades"("endereco", "bairro");

-- CreateIndex
CREATE UNIQUE INDEX "modalidades_endereco_bairro_key" ON "modalidades"("endereco", "bairro");

-- AddForeignKey
ALTER TABLE "modalidades" ADD CONSTRAINT "modalidades_endereco_bairro_fkey" FOREIGN KEY ("endereco", "bairro") REFERENCES "localidades"("endereco", "bairro") ON DELETE RESTRICT ON UPDATE CASCADE;
