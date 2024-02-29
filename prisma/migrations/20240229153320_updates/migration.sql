/*
  Warnings:

  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,createdAt,updatedAt]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,cpf,createdAt,updatedAt]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_createdAt_updatedAt_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_id_fkey";

-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_createdAt_updatedAt_fkey";

-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_id_fkey";

-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_createdAt_updatedAt_fkey";

-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_id_cpf_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_createdAt_updatedAt_fkey";

-- DropIndex
DROP INDEX "Admin_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "Professor_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "alunos_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "alunos_id_cpf_key";

-- DropIndex
DROP INDEX "users_id_cpf_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Time";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_createdAt_updatedAt_key" ON "Admin"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_id_createdAt_updatedAt_key" ON "Professor"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_cpf_createdAt_updatedAt_key" ON "alunos"("id", "cpf", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_cpf_createdAt_updatedAt_key" ON "users"("id", "cpf", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_createdAt_updatedAt_key" ON "users"("id", "createdAt", "updatedAt");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "cpf", "createdAt", "updatedAt") REFERENCES "users"("id", "cpf", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "users"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "users"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;
