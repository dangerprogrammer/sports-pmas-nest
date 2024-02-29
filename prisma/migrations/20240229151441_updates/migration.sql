/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,updatedAt]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,updatedAt]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,updatedAt]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt,updatedAt]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "alunos" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Time_createdAt_updatedAt_key" ON "Time"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_createdAt_updatedAt_key" ON "Admin"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_createdAt_updatedAt_key" ON "Professor"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_createdAt_updatedAt_key" ON "alunos"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_createdAt_updatedAt_key" ON "users"("createdAt", "updatedAt");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_createdAt_updatedAt_fkey" FOREIGN KEY ("createdAt", "updatedAt") REFERENCES "Time"("createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_createdAt_updatedAt_fkey" FOREIGN KEY ("createdAt", "updatedAt") REFERENCES "Time"("createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_createdAt_updatedAt_fkey" FOREIGN KEY ("createdAt", "updatedAt") REFERENCES "Time"("createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createdAt_updatedAt_fkey" FOREIGN KEY ("createdAt", "updatedAt") REFERENCES "Time"("createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;
