/*
  Warnings:

  - Made the column `displayArtist` on table `releases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "releases" ALTER COLUMN "displayArtist" SET NOT NULL,
ALTER COLUMN "releaseDate" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sendCopy" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_submissions_email_idx" ON "form_submissions"("email");

-- CreateIndex
CREATE INDEX "form_submissions_createdAt_idx" ON "form_submissions"("createdAt");
