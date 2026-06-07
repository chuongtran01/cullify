DROP INDEX IF EXISTS "image_group_representative_image_id_idx";

ALTER TABLE "image_group"
  DROP CONSTRAINT IF EXISTS "image_group_representative_image_id_fkey";

ALTER TABLE "image_group"
  DROP COLUMN IF EXISTS "representative_image_id";

ALTER TABLE "image"
  ADD COLUMN IF NOT EXISTS "group_id" UUID;

CREATE INDEX IF NOT EXISTS "image_group_id_idx" ON "image"("group_id");

ALTER TABLE "image"
  ADD CONSTRAINT "image_group_id_fkey"
  FOREIGN KEY ("group_id") REFERENCES "image_group"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE IF EXISTS "group_image";
