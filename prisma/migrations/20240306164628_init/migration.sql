-- AlterTable
CREATE SEQUENCE inscricao_id_seq;
ALTER TABLE "Inscricao" ALTER COLUMN "id" SET DEFAULT nextval('inscricao_id_seq');
ALTER SEQUENCE inscricao_id_seq OWNED BY "Inscricao"."id";
