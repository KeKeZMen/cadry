-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_id_fkey";

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
