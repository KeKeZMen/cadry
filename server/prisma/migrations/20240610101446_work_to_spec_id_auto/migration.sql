-- AlterTable
CREATE SEQUENCE work_profession_to_speciality_id_seq;
ALTER TABLE "work_profession_to_speciality" ALTER COLUMN "id" SET DEFAULT nextval('work_profession_to_speciality_id_seq');
ALTER SEQUENCE work_profession_to_speciality_id_seq OWNED BY "work_profession_to_speciality"."id";
