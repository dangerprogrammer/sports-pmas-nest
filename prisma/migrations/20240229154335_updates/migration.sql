/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt,updatedAt]` on the table `alunos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AlunoMenor" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nomeResp1" TEXT NOT NULL,
    "cpfResp1" TEXT NOT NULL,
    "emailResp1" TEXT NOT NULL,
    "telResp1" TEXT NOT NULL,
    "nomeResp2" TEXT,
    "cpfResp2" TEXT,
    "emailResp2" TEXT,
    "telResp2" TEXT,

    CONSTRAINT "AlunoMenor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlunoMenor_id_createdAt_updatedAt_key" ON "AlunoMenor"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_createdAt_updatedAt_key" ON "alunos"("id", "createdAt", "updatedAt");

-- AddForeignKey
ALTER TABLE "AlunoMenor" ADD CONSTRAINT "AlunoMenor_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "alunos"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;
