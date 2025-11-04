/*
  Warnings:

  - Made the column `releaseDate` on table `releases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `releases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "releases" ALTER COLUMN "displayArtist" DROP NOT NULL,
ALTER COLUMN "releaseDate" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE INDEX "releases_type_idx" ON "releases"("type");
