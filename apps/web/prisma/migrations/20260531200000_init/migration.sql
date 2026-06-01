CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE "CollectionStatus" AS ENUM (
  'UPLOADING',
  'PROCESSING',
  'READY_FOR_REVIEW',
  'IN_REVIEW',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE "ImageUploadStatus" AS ENUM ('PENDING', 'UPLOADED', 'FAILED');

CREATE TABLE "user" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_verified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "session" (
  "id" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "user_id" TEXT NOT NULL,

  CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "account" (
  "id" TEXT NOT NULL,
  "account_id" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "id_token" TEXT,
  "access_token_expires_at" TIMESTAMP(3),
  "refresh_token_expires_at" TIMESTAMP(3),
  "scope" TEXT,
  "password" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "collection" (
  "id" UUID NOT NULL,
  "user_id" TEXT NOT NULL,
  "name" VARCHAR(100),
  "status" "CollectionStatus" NOT NULL DEFAULT 'UPLOADING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "image" (
  "id" UUID NOT NULL,
  "collection_id" UUID NOT NULL,
  "file_name" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "object_key" TEXT NOT NULL,
  "status" "ImageUploadStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "uploaded_at" TIMESTAMP(3),

  CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "image_quality_analysis" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "image_id" UUID NOT NULL,
  "blur_score" DOUBLE PRECISION,
  "focus_score" DOUBLE PRECISION,
  "motion_blur_score" DOUBLE PRECISION,
  "eye_closed_score" DOUBLE PRECISION,
  "exposure_score" DOUBLE PRECISION,
  "compression_score" DOUBLE PRECISION,
  "overall_quality_score" DOUBLE PRECISION,
  "is_blurry" BOOLEAN NOT NULL DEFAULT false,
  "is_out_of_focus" BOOLEAN NOT NULL DEFAULT false,
  "has_motion_blur" BOOLEAN NOT NULL DEFAULT false,
  "has_eyes_closed" BOOLEAN NOT NULL DEFAULT false,
  "is_low_exposure" BOOLEAN NOT NULL DEFAULT false,
  "is_high_exposure" BOOLEAN NOT NULL DEFAULT false,
  "has_compression_artifacts" BOOLEAN NOT NULL DEFAULT false,
  "analysis_error" TEXT,
  "flags" JSONB,
  "raw" JSONB,
  "analyzed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "image_quality_analysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "image_embedding" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "image_id" UUID NOT NULL,
  "model" TEXT NOT NULL,
  "version" TEXT,
  "dimension" INTEGER NOT NULL,
  "vector" vector(512),
  "vector_ref" TEXT,
  "embedding_error" TEXT,
  "raw" JSONB,
  "embedded_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "image_embedding_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE INDEX "session_user_id_idx" ON "session"("user_id");
CREATE INDEX "account_user_id_idx" ON "account"("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
CREATE INDEX "collection_user_id_idx" ON "collection"("user_id");
CREATE INDEX "image_collection_id_idx" ON "image"("collection_id");
CREATE UNIQUE INDEX "image_object_key_key" ON "image"("object_key");
CREATE INDEX "image_status_idx" ON "image"("status");
CREATE UNIQUE INDEX "image_quality_analysis_image_id_key" ON "image_quality_analysis"("image_id");
CREATE INDEX "image_quality_analysis_analyzed_at_idx" ON "image_quality_analysis"("analyzed_at");
CREATE UNIQUE INDEX "image_embedding_image_id_key" ON "image_embedding"("image_id");
CREATE INDEX "image_embedding_model_idx" ON "image_embedding"("model");
CREATE INDEX "image_embedding_embedded_at_idx" ON "image_embedding"("embedded_at");

ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "collection" ADD CONSTRAINT "collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "image" ADD CONSTRAINT "image_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "image_quality_analysis" ADD CONSTRAINT "image_quality_analysis_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "image_embedding" ADD CONSTRAINT "image_embedding_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
