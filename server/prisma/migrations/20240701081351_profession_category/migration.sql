/*
  Warnings:

  - Added the required column `category` to the `professions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professions" ADD COLUMN     "category" TEXT NOT NULL;
