/*
  Warnings:

  - A unique constraint covering the columns `[resultId]` on the table `UserTest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserTest" ADD COLUMN     "resultId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserTest_resultId_key" ON "UserTest"("resultId");

-- AddForeignKey
ALTER TABLE "UserTest" ADD CONSTRAINT "UserTest_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
