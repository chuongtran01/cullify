-- CreateTable
CREATE TABLE "ImageQualityAnalysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "imageId" UUID NOT NULL,
    "blurScore" DOUBLE PRECISION,
    "focusScore" DOUBLE PRECISION,
    "motionBlurScore" DOUBLE PRECISION,
    "eyeClosedScore" DOUBLE PRECISION,
    "exposureScore" DOUBLE PRECISION,
    "compressionScore" DOUBLE PRECISION,
    "overallQualityScore" DOUBLE PRECISION,
    "isBlurry" BOOLEAN NOT NULL DEFAULT false,
    "isOutOfFocus" BOOLEAN NOT NULL DEFAULT false,
    "hasMotionBlur" BOOLEAN NOT NULL DEFAULT false,
    "hasEyesClosed" BOOLEAN NOT NULL DEFAULT false,
    "isLowExposure" BOOLEAN NOT NULL DEFAULT false,
    "hasCompressionArtifacts" BOOLEAN NOT NULL DEFAULT false,
    "flags" JSONB,
    "raw" JSONB,
    "analyzedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageQualityAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageQualityAnalysis_imageId_key" ON "ImageQualityAnalysis"("imageId");

-- CreateIndex
CREATE INDEX "ImageQualityAnalysis_analyzedAt_idx" ON "ImageQualityAnalysis"("analyzedAt");

-- AddForeignKey
ALTER TABLE "ImageQualityAnalysis" ADD CONSTRAINT "ImageQualityAnalysis_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

