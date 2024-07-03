/*
  Warnings:

  - The `sub_professions` column on the `students` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "sub_professions",
ADD COLUMN     "sub_professions" JSONB[];
