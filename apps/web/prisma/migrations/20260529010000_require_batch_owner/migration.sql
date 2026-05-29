DELETE FROM "ImageQualityAnalysis";
DELETE FROM "Image";
DELETE FROM "Batch";

ALTER TABLE "Batch" ADD COLUMN "userId" TEXT NOT NULL;

CREATE INDEX "Batch_userId_idx" ON "Batch"("userId");

ALTER TABLE "Batch" ADD CONSTRAINT "Batch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
