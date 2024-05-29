/*
  Warnings:

  - You are about to drop the column `inn` on the `branches` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "branches_inn_key";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "inn";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "branch_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
