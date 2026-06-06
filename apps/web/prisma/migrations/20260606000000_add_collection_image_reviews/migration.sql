CREATE TYPE "ReviewDecisionSource" AS ENUM (
  'DEFAULT',
  'USER'
);

CREATE TYPE "ReviewDecisionReason" AS ENUM (
  'GOOD_STANDALONE',
  'LOW_QUALITY',
  'SIMILAR_GROUP'
);

CREATE TABLE "collection_image_review" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "collection_id" UUID NOT NULL,
  "image_id" UUID NOT NULL,
  "is_selected" BOOLEAN NOT NULL DEFAULT false,
  "decision_source" "ReviewDecisionSource" NOT NULL DEFAULT 'DEFAULT',
  "decision_reason" "ReviewDecisionReason" NOT NULL,
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "collection_image_review_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "collection_image_review_collection_id_idx" ON "collection_image_review"("collection_id");
CREATE INDEX "collection_image_review_decision_source_idx" ON "collection_image_review"("decision_source");
CREATE INDEX "collection_image_review_decision_reason_idx" ON "collection_image_review"("decision_reason");
CREATE INDEX "collection_image_review_is_selected_idx" ON "collection_image_review"("is_selected");
CREATE UNIQUE INDEX "collection_image_review_image_id_key" ON "collection_image_review"("image_id");

ALTER TABLE "collection_image_review" ADD CONSTRAINT "collection_image_review_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "collection_image_review" ADD CONSTRAINT "collection_image_review_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
