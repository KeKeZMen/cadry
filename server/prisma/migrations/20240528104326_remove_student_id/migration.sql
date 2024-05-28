/*
  Warnings:

  - You are about to drop the column `student_id` on the `users` table. All the data in the column will be lost.
  - Made the column `address` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "students" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "ready_to_move" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "student_id";
