/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt,updatedAt,accepted]` on the table `aluno_menors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt,nome_comp,accepted]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt,accepted]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt,accepted]` on the table `atestados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt,nome_comp,accepted]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "aluno_menors" DROP CONSTRAINT "aluno_menors_id_createdAt_updatedAt_fkey";

-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_nome_comp_fkey";

-- DropForeignKey
ALTER TABLE "atestados" DROP CONSTRAINT "atestados_id_createdAt_updatedAt_fkey";

-- DropIndex
DROP INDEX "aluno_menors_id_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "alunos_id_cpf_createdAt_updatedAt_nome_comp_key";

-- DropIndex
DROP INDEX "alunos_id_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "atestados_id_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "users_id_cpf_createdAt_updatedAt_nome_comp_key";

-- AlterTable
ALTER TABLE "aluno_menors" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "alunos" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "atestados" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accepted" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "aluno_menors_id_createdAt_updatedAt_accepted_key" ON "aluno_menors"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_cpf_createdAt_updatedAt_nome_comp_accepted_key" ON "alunos"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_createdAt_updatedAt_accepted_key" ON "alunos"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "atestados_id_createdAt_updatedAt_accepted_key" ON "atestados"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_cpf_createdAt_updatedAt_nome_comp_accepted_key" ON "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_nome_comp_accepted_fkey" FOREIGN KEY ("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted") REFERENCES "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atestados" ADD CONSTRAINT "atestados_id_createdAt_updatedAt_accepted_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "accepted") REFERENCES "alunos"("id", "createdAt", "updatedAt", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_menors" ADD CONSTRAINT "aluno_menors_id_createdAt_updatedAt_accepted_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "accepted") REFERENCES "alunos"("id", "createdAt", "updatedAt", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;
