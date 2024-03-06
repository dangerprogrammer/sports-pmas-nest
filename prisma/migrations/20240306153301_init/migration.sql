-- DropForeignKey
ALTER TABLE "Inscricao" DROP CONSTRAINT "Inscricao_aula_fkey";

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_aula_fkey" FOREIGN KEY ("aula") REFERENCES "Inscricao"("aula") ON DELETE SET NULL ON UPDATE CASCADE;
