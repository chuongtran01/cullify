import "server-only";

import { prisma } from "@/lib/prisma";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";

export type CollectionGroupSummary = {
  id: string;
  collectionId: string;
  representativeImageId: string | null;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionGroupsResponse = {
  groups: CollectionGroupSummary[];
  totalGroups: number;
  totalImages: number;
};

export type CollectionGroupImage = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  createdAt: string;
  imageUrl: string;
};

export type CollectionGroupDetail = CollectionGroupSummary & {
  images: CollectionGroupImage[];
};

export async function listCollectionGroups(
  collectionId: string,
  userId: string,
): Promise<CollectionGroupsResponse | null> {
  const collectionRows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM "collection"
    WHERE id = ${collectionId}::uuid
      AND user_id = ${userId}
    LIMIT 1
  `;

  if (collectionRows.length === 0) {
    return null;
  }

  const rows = await prisma.$queryRaw<GroupSummaryRow[]>`
    SELECT
      id::text,
      collection_id::text AS "collectionId",
      representative_image_id::text AS "representativeImageId",
      image_count AS "imageCount",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM image_group
    WHERE collection_id = ${collectionId}::uuid
    ORDER BY image_count DESC, created_at ASC
  `;
  const groups = rows.map(formatGroupSummary);

  return {
    groups,
    totalGroups: groups.length,
    totalImages: groups.reduce((total, group) => total + group.imageCount, 0),
  };
}

export async function getCollectionGroup(
  collectionId: string,
  groupId: string,
  userId: string,
): Promise<CollectionGroupDetail | null> {
  const groupRows = await prisma.$queryRaw<GroupSummaryRow[]>`
    SELECT
      image_group.id::text,
      image_group.collection_id::text AS "collectionId",
      image_group.representative_image_id::text AS "representativeImageId",
      image_group.image_count AS "imageCount",
      image_group.created_at AS "createdAt",
      image_group.updated_at AS "updatedAt"
    FROM image_group
    INNER JOIN "collection"
      ON "collection".id = image_group.collection_id
    WHERE image_group.id = ${groupId}::uuid
      AND image_group.collection_id = ${collectionId}::uuid
      AND "collection".user_id = ${userId}
    LIMIT 1
  `;

  if (groupRows.length === 0) {
    return null;
  }

  const group = groupRows[0];
  const imageRows = await prisma.$queryRaw<GroupImageRow[]>`
    SELECT
      image.id::text,
      image.file_name AS "fileName",
      image.object_key AS "objectKey",
      image.mime_type AS "mimeType",
      image.created_at AS "createdAt"
    FROM group_image
    INNER JOIN image
      ON image.id = group_image.image_id
    WHERE group_image.group_id = ${groupId}::uuid
    ORDER BY image.created_at ASC
  `;
  const images = await Promise.all(
    imageRows.map(async (image) => ({
      id: image.id,
      fileName: image.fileName,
      objectKey: image.objectKey,
      mimeType: image.mimeType,
      createdAt: image.createdAt.toISOString(),
      imageUrl: await createPresignedDownloadUrl(image.objectKey),
    })),
  );

  return {
    ...formatGroupSummary(group),
    images,
  };
}

export async function updateCollectionGroupRepresentative(
  collectionId: string,
  groupId: string,
  userId: string,
  representativeImageId: string | null,
): Promise<boolean> {
  const groupRows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT image_group.id::text
    FROM image_group
    INNER JOIN "collection"
      ON "collection".id = image_group.collection_id
    WHERE image_group.id = ${groupId}::uuid
      AND image_group.collection_id = ${collectionId}::uuid
      AND "collection".user_id = ${userId}
    LIMIT 1
  `;

  if (groupRows.length === 0) {
    return false;
  }

  if (representativeImageId !== null) {
    const membershipRows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id::text
      FROM group_image
      WHERE group_id = ${groupId}::uuid
        AND image_id = ${representativeImageId}::uuid
      LIMIT 1
    `;

    if (membershipRows.length === 0) {
      return false;
    }
  }

  await prisma.$executeRaw`
    UPDATE image_group
    SET
      representative_image_id = ${representativeImageId}::uuid,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${groupId}::uuid
  `;

  return true;
}

type GroupSummaryRow = {
  id: string;
  collectionId: string;
  representativeImageId: string | null;
  imageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type GroupImageRow = {
  id: string;
  fileName: string;
  objectKey: string;
  mimeType: string;
  createdAt: Date;
};

function formatGroupSummary(group: GroupSummaryRow): CollectionGroupSummary {
  return {
    id: group.id,
    collectionId: group.collectionId,
    representativeImageId: group.representativeImageId,
    imageCount: group.imageCount,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  };
}
