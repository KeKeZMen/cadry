-- CreateEnum
CREATE TYPE "DisabilitiesTypes" AS ENUM ('visuallyImpaired', 'hardHearing', 'speechDisorders', 'musculoskeletalDisorders', 'impairedMental', 'intellectualImpairment', 'autismDisorder');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'Employment', 'Graduates');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Man', 'Women');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('EducationOrganization', 'Organization');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "student_id" TEXT,
    "branch_id" TEXT,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "photo_url" TEXT,
    "graduate_year" INTEGER NOT NULL,
    "address" TEXT,
    "portfolio_url" TEXT,
    "ready_to_move" BOOLEAN NOT NULL,
    "sub_info" TEXT,
    "education_organization_id" TEXT NOT NULL,
    "favorites_organizations" TEXT[],
    "disability" "DisabilitiesTypes",
    "gender" "Gender" NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "education_organization_id" TEXT,
    "work_organization_id" TEXT NOT NULL,
    "speciality_id" INTEGER,
    "profession_id" INTEGER,
    "count" INTEGER NOT NULL,
    "request_year" TIMESTAMP(3),
    "salary" INTEGER NOT NULL,
    "ready_to_move" BOOLEAN NOT NULL DEFAULT false,
    "target_agreement" BOOLEAN NOT NULL DEFAULT false,
    "is_disability" BOOLEAN NOT NULL DEFAULT false,
    "quotas" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "web" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "inn" VARCHAR(12) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directions" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "directions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "direction_id" INTEGER NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speciality_id" INTEGER NOT NULL,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE INDEX "students_id_idx" ON "students"("id");

-- CreateIndex
CREATE INDEX "requests_id_idx" ON "requests"("id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_inn_key" ON "organizations"("inn");

-- CreateIndex
CREATE INDEX "organizations_id_idx" ON "organizations"("id");

-- CreateIndex
CREATE INDEX "branches_id_idx" ON "branches"("id");

-- CreateIndex
CREATE INDEX "directions_id_idx" ON "directions"("id");

-- CreateIndex
CREATE INDEX "specialities_id_idx" ON "specialities"("id");

-- CreateIndex
CREATE INDEX "professions_id_idx" ON "professions"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_education_organization_id_fkey" FOREIGN KEY ("education_organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_work_organization_id_fkey" FOREIGN KEY ("work_organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialities" ADD CONSTRAINT "specialities_direction_id_fkey" FOREIGN KEY ("direction_id") REFERENCES "directions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professions" ADD CONSTRAINT "professions_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
