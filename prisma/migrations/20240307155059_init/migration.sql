-- DropForeignKey
ALTER TABLE "solics" DROP CONSTRAINT "solics_adminId_fkey";

-- CreateTable
CREATE TABLE "_AdminToSolic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToSolic_AB_unique" ON "_AdminToSolic"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToSolic_B_index" ON "_AdminToSolic"("B");

-- AddForeignKey
ALTER TABLE "_AdminToSolic" ADD CONSTRAINT "_AdminToSolic_A_fkey" FOREIGN KEY ("A") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToSolic" ADD CONSTRAINT "_AdminToSolic_B_fkey" FOREIGN KEY ("B") REFERENCES "solics"("adminId") ON DELETE CASCADE ON UPDATE CASCADE;
