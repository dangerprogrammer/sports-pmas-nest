/*
  Warnings:

  - You are about to drop the column `name` on the `modalidades` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aula]` on the table `Inscricao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aula]` on the table `horarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "modalidades_name_key";

-- AlterTable
ALTER TABLE "horarios" ADD COLUMN     "aula" "Aula";

-- AlterTable
ALTER TABLE "modalidades" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_aula_key" ON "Inscricao"("aula");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_aula_key" ON "horarios"("aula");

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_aula_fkey" FOREIGN KEY ("aula") REFERENCES "horarios"("aula") ON DELETE RESTRICT ON UPDATE CASCADE;
