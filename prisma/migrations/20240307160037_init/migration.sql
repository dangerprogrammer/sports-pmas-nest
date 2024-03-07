/*
  Warnings:

  - The primary key for the `solics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminId` on the `solics` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdminToSolic" DROP CONSTRAINT "_AdminToSolic_B_fkey";

-- AlterTable
ALTER TABLE "solics" DROP CONSTRAINT "solics_pkey",
DROP COLUMN "adminId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "solics_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "_AdminToSolic" ADD CONSTRAINT "_AdminToSolic_B_fkey" FOREIGN KEY ("B") REFERENCES "solics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
