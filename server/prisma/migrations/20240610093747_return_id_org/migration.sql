/*
  Warnings:

  - The required column `id` was added to the `organizations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_education_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_work_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_education_organization_id_fkey";

-- DropIndex
DROP INDEX "organizations_user_id_idx";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "organizations_id_idx" ON "organizations"("id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_work_organization_id_fkey" FOREIGN KEY ("work_organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
