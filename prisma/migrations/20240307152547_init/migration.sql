-- AlterTable
CREATE SEQUENCE solics_adminid_seq;
ALTER TABLE "solics" ALTER COLUMN "adminId" SET DEFAULT nextval('solics_adminid_seq');
ALTER SEQUENCE solics_adminid_seq OWNED BY "solics"."adminId";
