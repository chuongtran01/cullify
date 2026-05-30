ALTER TABLE "ImageQualityAnalysis"
ADD COLUMN "isHighExposure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "analysisError" TEXT;
