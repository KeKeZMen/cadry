/*
  Warnings:

  - The values [Manager,Employment,Graduates] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `branch_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inn]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profession_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('Manager', 'Employment', 'Graduates');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Admin', 'Student', 'Employee', 'Organization');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_branch_id_fkey";

-- DropIndex
DROP INDEX "students_user_id_idx";

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "inn" CHAR(12);

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "profession_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "branch_id";

-- CreateTable
CREATE TABLE "employees" (
    "user_id" TEXT NOT NULL,
    "employee_type" "EmployeeType" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "branches_inn_key" ON "branches"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "branches_email_key" ON "branches"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_user_id_key" ON "organizations"("user_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
