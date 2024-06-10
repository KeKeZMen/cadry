/*
  Warnings:

  - The primary key for the `organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `professions` table. All the data in the column will be lost.
  - You are about to drop the column `speciality_id` on the `professions` table. All the data in the column will be lost.
  - You are about to drop the column `profession_id` on the `students` table. All the data in the column will be lost.
  - Added the required column `name` to the `directions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `specialities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciality_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "professions" DROP CONSTRAINT "professions_speciality_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_education_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_work_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_education_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_profession_id_fkey";

-- DropIndex
DROP INDEX "organizations_id_idx";

-- AlterTable
ALTER TABLE "directions" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "professions" DROP COLUMN "key",
DROP COLUMN "speciality_id";

-- AlterTable
ALTER TABLE "specialities" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "profession_id",
ADD COLUMN     "speciality_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "work_profession_to_speciality" (
    "id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "work_profession_id" INTEGER NOT NULL,

    CONSTRAINT "work_profession_to_speciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "work_profession_to_speciality_id_idx" ON "work_profession_to_speciality"("id");

-- CreateIndex
CREATE INDEX "organizations_user_id_idx" ON "organizations"("user_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_work_organization_id_fkey" FOREIGN KEY ("work_organization_id") REFERENCES "organizations"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_profession_to_speciality" ADD CONSTRAINT "work_profession_to_speciality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_profession_to_speciality" ADD CONSTRAINT "work_profession_to_speciality_work_profession_id_fkey" FOREIGN KEY ("work_profession_id") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
