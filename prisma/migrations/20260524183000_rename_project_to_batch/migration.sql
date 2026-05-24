-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- RenameTable
ALTER TABLE "Project" RENAME TO "Batch";

-- AlterTable
ALTER TABLE "Batch" ADD COLUMN "status" "BatchStatus" NOT NULL DEFAULT 'UPLOADING';

-- AlterTable
ALTER TABLE "Image" RENAME COLUMN "projectId" TO "batchId";

-- RenameIndex
ALTER INDEX "Image_projectId_idx" RENAME TO "Image_batchId_idx";

-- RenameForeignKey
ALTER TABLE "Image" RENAME CONSTRAINT "Image_projectId_fkey" TO "Image_batchId_fkey";

-- Backfill batch status for batches that already finished uploading
UPDATE "Batch" AS b
SET "status" = 'PROCESSING'
WHERE NOT EXISTS (
  SELECT 1
  FROM "Image" AS i
  WHERE i."batchId" = b."id"
    AND i."status" != 'UPLOADED'
)
AND EXISTS (
  SELECT 1 FROM "Image" AS i WHERE i."batchId" = b."id"
);
