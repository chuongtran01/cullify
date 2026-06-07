DROP INDEX IF EXISTS "image_group_representative_image_id_idx";

ALTER TABLE "image_group"
  DROP CONSTRAINT IF EXISTS "image_group_representative_image_id_fkey";

ALTER TABLE "image_group"
  DROP COLUMN IF EXISTS "representative_image_id";
