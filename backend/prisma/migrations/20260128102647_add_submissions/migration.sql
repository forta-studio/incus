-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('DEMO', 'RADIO');

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "type" "SubmissionType" NOT NULL,
    "audioFileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submissions_email_idx" ON "submissions"("email");

-- CreateIndex
CREATE INDEX "submissions_type_idx" ON "submissions"("type");

-- CreateIndex
CREATE INDEX "submissions_createdAt_idx" ON "submissions"("createdAt");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "audio_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
