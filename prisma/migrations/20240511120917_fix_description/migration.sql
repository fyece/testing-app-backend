/*
  Warnings:

  - You are about to drop the column `discription` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `discription` on the `Test` table. All the data in the column will be lost.
  - Added the required column `description` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT NOT NULL;
