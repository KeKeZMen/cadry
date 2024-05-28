/*
  Warnings:

  - The primary key for the `students` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `students` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "students_id_idx";

-- AlterTable
ALTER TABLE "students" DROP CONSTRAINT "students_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE INDEX "students_user_id_idx" ON "students"("user_id");
