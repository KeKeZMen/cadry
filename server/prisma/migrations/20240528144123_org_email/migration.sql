/*
  Warnings:

  - Made the column `email` on table `organizations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ready_to_move` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "ready_to_move" SET NOT NULL,
ALTER COLUMN "ready_to_move" SET DEFAULT false;
