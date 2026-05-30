ALTER TABLE "Batch" RENAME TO "batch";
ALTER TABLE "Image" RENAME TO "image";
ALTER TABLE "ImageQualityAnalysis" RENAME TO "image_quality_analysis";

ALTER TABLE "batch" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "batch" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "batch" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "image" RENAME COLUMN "batchId" TO "batch_id";
ALTER TABLE "image" RENAME COLUMN "fileName" TO "file_name";
ALTER TABLE "image" RENAME COLUMN "mimeType" TO "mime_type";
ALTER TABLE "image" RENAME COLUMN "sizeBytes" TO "size_bytes";
ALTER TABLE "image" RENAME COLUMN "objectKey" TO "object_key";
ALTER TABLE "image" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "image" RENAME COLUMN "uploadedAt" TO "uploaded_at";

ALTER TABLE "image_quality_analysis" RENAME COLUMN "imageId" TO "image_id";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "blurScore" TO "blur_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "focusScore" TO "focus_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "motionBlurScore" TO "motion_blur_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "eyeClosedScore" TO "eye_closed_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "exposureScore" TO "exposure_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "compressionScore" TO "compression_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "overallQualityScore" TO "overall_quality_score";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "isBlurry" TO "is_blurry";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "isOutOfFocus" TO "is_out_of_focus";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "hasMotionBlur" TO "has_motion_blur";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "hasEyesClosed" TO "has_eyes_closed";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "isLowExposure" TO "is_low_exposure";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "isHighExposure" TO "is_high_exposure";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "hasCompressionArtifacts" TO "has_compression_artifacts";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "analysisError" TO "analysis_error";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "analyzedAt" TO "analyzed_at";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "image_quality_analysis" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "user" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "session" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "session" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "session" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "session" RENAME COLUMN "ipAddress" TO "ip_address";
ALTER TABLE "session" RENAME COLUMN "userAgent" TO "user_agent";
ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";

ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";
ALTER TABLE "account" RENAME COLUMN "providerId" TO "provider_id";
ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "account" RENAME COLUMN "accessToken" TO "access_token";
ALTER TABLE "account" RENAME COLUMN "refreshToken" TO "refresh_token";
ALTER TABLE "account" RENAME COLUMN "idToken" TO "id_token";
ALTER TABLE "account" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "account" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "verification" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "verification" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "verification" RENAME COLUMN "updatedAt" TO "updated_at";
