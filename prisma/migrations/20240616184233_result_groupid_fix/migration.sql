-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_groupId_fkey";

-- AlterTable
ALTER TABLE "Result" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
