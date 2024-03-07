-- CreateEnum
CREATE TYPE "Periodo" AS ENUM ('MANHA', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "Aula" AS ENUM ('NATACAO', 'HIDRO');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMININO', 'MASCULINO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "roles" "Roles"[] DEFAULT ARRAY['ALUNO']::"Roles"[],
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome_comp" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "sexo" "Gender" NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atestados" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anexo" TEXT NOT NULL,
    "msg" TEXT,

    CONSTRAINT "atestados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno_menors" (
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

    CONSTRAINT "aluno_menors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professors" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" SERIAL NOT NULL,
    "aula" "Aula" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modalidades" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" "Aula" NOT NULL,
    "endereco" TEXT NOT NULL DEFAULT 'Endereco...',
    "bairro" TEXT NOT NULL DEFAULT 'Bairro...',
    "vagas" INTEGER DEFAULT 15,

    CONSTRAINT "modalidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "periodo" "Periodo" NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidades" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_aluno_modalidade" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_horario_modalidade" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_cpf_createdAt_updatedAt_key" ON "users"("id", "cpf", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_createdAt_updatedAt_key" ON "users"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_createdAt_updatedAt_key" ON "users"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_cpf_createdAt_updatedAt_key" ON "alunos"("id", "cpf", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_createdAt_updatedAt_key" ON "alunos"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "atestados_id_createdAt_updatedAt_key" ON "atestados"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_menors_id_createdAt_updatedAt_key" ON "aluno_menors"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "professors_id_createdAt_updatedAt_key" ON "professors"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "admins_id_createdAt_updatedAt_key" ON "admins"("id", "createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_aula_key" ON "Inscricao"("aula");

-- CreateIndex
CREATE UNIQUE INDEX "modalidades_name_key" ON "modalidades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "modalidades_endereco_bairro_key" ON "modalidades"("endereco", "bairro");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_time_key" ON "horarios"("time");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_key" ON "localidades"("endereco");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_bairro_key" ON "localidades"("bairro");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_bairro_key" ON "localidades"("endereco", "bairro");

-- CreateIndex
CREATE UNIQUE INDEX "_aluno_modalidade_AB_unique" ON "_aluno_modalidade"("A", "B");

-- CreateIndex
CREATE INDEX "_aluno_modalidade_B_index" ON "_aluno_modalidade"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_horario_modalidade_AB_unique" ON "_horario_modalidade"("A", "B");

-- CreateIndex
CREATE INDEX "_horario_modalidade_B_index" ON "_horario_modalidade"("B");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "cpf", "createdAt", "updatedAt") REFERENCES "users"("id", "cpf", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atestados" ADD CONSTRAINT "atestados_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "alunos"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_menors" ADD CONSTRAINT "aluno_menors_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "alunos"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "users"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_createdAt_updatedAt_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt") REFERENCES "users"("id", "createdAt", "updatedAt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_id_fkey" FOREIGN KEY ("id") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_time_fkey" FOREIGN KEY ("time") REFERENCES "horarios"("time") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modalidades" ADD CONSTRAINT "modalidades_endereco_bairro_fkey" FOREIGN KEY ("endereco", "bairro") REFERENCES "localidades"("endereco", "bairro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aluno_modalidade" ADD CONSTRAINT "_aluno_modalidade_A_fkey" FOREIGN KEY ("A") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aluno_modalidade" ADD CONSTRAINT "_aluno_modalidade_B_fkey" FOREIGN KEY ("B") REFERENCES "modalidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_A_fkey" FOREIGN KEY ("A") REFERENCES "horarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_B_fkey" FOREIGN KEY ("B") REFERENCES "modalidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
