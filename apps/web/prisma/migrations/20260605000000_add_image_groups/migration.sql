CREATE TABLE "image_group" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "collection_id" UUID NOT NULL,
  "representative_image_id" UUID,
  "image_count" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "image_group_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "group_image" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "group_id" UUID NOT NULL,
  "image_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "group_image_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "image_group_collection_id_idx" ON "image_group"("collection_id");
CREATE INDEX "image_group_representative_image_id_idx" ON "image_group"("representative_image_id");
CREATE INDEX "group_image_group_id_idx" ON "group_image"("group_id");
CREATE UNIQUE INDEX "group_image_image_id_key" ON "group_image"("image_id");

ALTER TABLE "image_group" ADD CONSTRAINT "image_group_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "image_group" ADD CONSTRAINT "image_group_representative_image_id_fkey" FOREIGN KEY ("representative_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "group_image" ADD CONSTRAINT "group_image_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "image_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "group_image" ADD CONSTRAINT "group_image_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
