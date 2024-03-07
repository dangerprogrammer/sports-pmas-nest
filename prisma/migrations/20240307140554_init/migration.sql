/*
  Warnings:

  - The `roles` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt,nome_comp]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt,nome_comp]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome_comp` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_fkey";

-- DropIndex
DROP INDEX "alunos_id_cpf_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "users_id_cpf_createdAt_updatedAt_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nome_comp" TEXT NOT NULL,
DROP COLUMN "roles",
ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['ALUNO']::"Role"[];

-- DropEnum
DROP TYPE "Roles";

-- CreateTable
CREATE TABLE "solics" (
    "adminId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "desc" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "solics_pkey" PRIMARY KEY ("adminId")
);

-- CreateIndex
CREATE UNIQUE INDEX "solics_userId_key" ON "solics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_cpf_createdAt_updatedAt_nome_comp_key" ON "alunos"("id", "cpf", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_cpf_createdAt_updatedAt_nome_comp_key" ON "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_nome_comp_fkey" FOREIGN KEY ("id", "cpf", "createdAt", "updatedAt", "nome_comp") REFERENCES "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solics" ADD CONSTRAINT "solics_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solics" ADD CONSTRAINT "solics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
