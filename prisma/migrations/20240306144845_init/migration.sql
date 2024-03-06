/*
  Warnings:

  - You are about to drop the column `inscricoes` on the `alunos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Aula" AS ENUM ('NATACAO', 'HIDRO');

-- AlterTable
ALTER TABLE "alunos" DROP COLUMN "inscricoes";

-- DropEnum
DROP TYPE "Inscricao";

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" INTEGER NOT NULL,
    "aula" "Aula" NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_id_fkey" FOREIGN KEY ("id") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
