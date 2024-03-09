-- CreateEnum
CREATE TYPE "Periodo" AS ENUM ('MANHA', 'TARDE', 'NOITE');

-- CreateEnum
CREATE TYPE "Aula" AS ENUM ('NATACAO', 'HIDRO');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMININO', 'MASCULINO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome_comp" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['ALUNO']::"Role"[],
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "accepted" BOOLEAN DEFAULT false,

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
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atestados" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anexo" TEXT NOT NULL,
    "msg" TEXT,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

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
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "aluno_menors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professors" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome_comp" TEXT NOT NULL,

    CONSTRAINT "professors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome_comp" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solics" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "desc" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "solics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "alunoId" SERIAL NOT NULL,
    "aula" "Aula" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL
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
CREATE TABLE "_AdminToSolic" (
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
CREATE UNIQUE INDEX "users_id_cpf_createdAt_updatedAt_nome_comp_accepted_key" ON "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_createdAt_updatedAt_nome_comp_key" ON "users"("id", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "users_createdAt_updatedAt_key" ON "users"("createdAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_cpf_createdAt_updatedAt_nome_comp_accepted_key" ON "alunos"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_createdAt_updatedAt_accepted_key" ON "alunos"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "atestados_id_createdAt_updatedAt_accepted_key" ON "atestados"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_menors_id_createdAt_updatedAt_accepted_key" ON "aluno_menors"("id", "createdAt", "updatedAt", "accepted");

-- CreateIndex
CREATE UNIQUE INDEX "professors_id_createdAt_updatedAt_nome_comp_key" ON "professors"("id", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "admins_id_createdAt_updatedAt_nome_comp_key" ON "admins"("id", "createdAt", "updatedAt", "nome_comp");

-- CreateIndex
CREATE UNIQUE INDEX "solics_userId_key" ON "solics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_time_key" ON "Inscricao"("time");

-- CreateIndex
CREATE UNIQUE INDEX "modalidades_name_key" ON "modalidades"("name");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_time_key" ON "horarios"("time");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_key" ON "localidades"("endereco");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_bairro_key" ON "localidades"("endereco", "bairro");

-- CreateIndex
CREATE UNIQUE INDEX "_aluno_modalidade_AB_unique" ON "_aluno_modalidade"("A", "B");

-- CreateIndex
CREATE INDEX "_aluno_modalidade_B_index" ON "_aluno_modalidade"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToSolic_AB_unique" ON "_AdminToSolic"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToSolic_B_index" ON "_AdminToSolic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_horario_modalidade_AB_unique" ON "_horario_modalidade"("A", "B");

-- CreateIndex
CREATE INDEX "_horario_modalidade_B_index" ON "_horario_modalidade"("B");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_cpf_createdAt_updatedAt_nome_comp_accepted_fkey" FOREIGN KEY ("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted") REFERENCES "users"("id", "cpf", "createdAt", "updatedAt", "nome_comp", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atestados" ADD CONSTRAINT "atestados_id_createdAt_updatedAt_accepted_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "accepted") REFERENCES "alunos"("id", "createdAt", "updatedAt", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_menors" ADD CONSTRAINT "aluno_menors_id_createdAt_updatedAt_accepted_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "accepted") REFERENCES "alunos"("id", "createdAt", "updatedAt", "accepted") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_id_createdAt_updatedAt_nome_comp_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "nome_comp") REFERENCES "users"("id", "createdAt", "updatedAt", "nome_comp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_id_createdAt_updatedAt_nome_comp_fkey" FOREIGN KEY ("id", "createdAt", "updatedAt", "nome_comp") REFERENCES "users"("id", "createdAt", "updatedAt", "nome_comp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solics" ADD CONSTRAINT "solics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_time_fkey" FOREIGN KEY ("time") REFERENCES "horarios"("time") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modalidades" ADD CONSTRAINT "modalidades_endereco_bairro_fkey" FOREIGN KEY ("endereco", "bairro") REFERENCES "localidades"("endereco", "bairro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aluno_modalidade" ADD CONSTRAINT "_aluno_modalidade_A_fkey" FOREIGN KEY ("A") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_aluno_modalidade" ADD CONSTRAINT "_aluno_modalidade_B_fkey" FOREIGN KEY ("B") REFERENCES "modalidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToSolic" ADD CONSTRAINT "_AdminToSolic_A_fkey" FOREIGN KEY ("A") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToSolic" ADD CONSTRAINT "_AdminToSolic_B_fkey" FOREIGN KEY ("B") REFERENCES "solics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_A_fkey" FOREIGN KEY ("A") REFERENCES "horarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_horario_modalidade" ADD CONSTRAINT "_horario_modalidade_B_fkey" FOREIGN KEY ("B") REFERENCES "modalidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
