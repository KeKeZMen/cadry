-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_speciality_id_fkey";

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
