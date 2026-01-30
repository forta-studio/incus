-- AlterTable
ALTER TABLE "form_submissions" ADD COLUMN     "mailingList" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "message" DROP NOT NULL;
