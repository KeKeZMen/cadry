/*
  Warnings:

  - Added the required column `gpa` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_adaptability` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "gpa" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "social_adaptability" INTEGER NOT NULL;
