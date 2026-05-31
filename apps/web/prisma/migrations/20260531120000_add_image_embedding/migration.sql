CREATE EXTENSION IF NOT EXISTS vector;

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

CREATE UNIQUE INDEX "image_embedding_image_id_key" ON "image_embedding"("image_id");

CREATE INDEX "image_embedding_model_idx" ON "image_embedding"("model");

CREATE INDEX "image_embedding_embedded_at_idx" ON "image_embedding"("embedded_at");

ALTER TABLE "image_embedding" ADD CONSTRAINT "image_embedding_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
