/*
  Warnings:

  - A unique constraint covering the columns `[endereco]` on the table `localidades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bairro]` on the table `localidades` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "localidades_endereco_key" ON "localidades"("endereco");

-- CreateIndex
CREATE UNIQUE INDEX "localidades_bairro_key" ON "localidades"("bairro");
