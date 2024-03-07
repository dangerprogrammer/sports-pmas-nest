/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt,updatedAt,nome_comp]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt,nome_comp]` on the table `professors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,createdAt,updatedAt,nome_comp]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome_comp` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_comp` to the `professors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_id_createdAt_updatedAt_fkey";

-- DropForeignKey
ALTER TABLE "professors" DROP CONSTRAINT "professors_id_createdAt_updatedAt_fkey";

-- DropIndex
DROP INDEX "admins_id_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "professors_id_createdAt_updatedAt_key";

-- DropIndex
DROP INDEX "users_id_createdAt_updatedAt_key";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "nome_comp" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professors" ADD COLUMN     "nome_comp" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_id_createdAt_updatedAt_nome_comp_key" ON "admins"("id", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "professors_id_createdAt_updatedAt_nome_comp_key" ON "professors"("id", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_createdAt_updatedAt_nome_comp_key" ON "users"("id", "createdAt", "updatedAt", "nome_comp");

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_id_createdAt_updatedAt_nome_comp_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "nome_comp") REFERENCES "users"("id", "createdAt", "updatedAt", "nome_comp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_createdAt_updatedAt_nome_comp_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "nome_comp") REFERENCES "users"("id", "createdAt", "updatedAt", "nome_comp") ON DELETE RESTRICT ON UPDATE CASCADE;
