import type { Collection, CollectionsSummary } from "@/components/collections/types";
import type { CollectionProgressData } from "@/components/collections/progress/types";

import {
  CollectionUploadError,
  CollectionUploadStorageError,
  CollectionsServiceError,
} from "@/services/collections/errors";
import type {
  CollectionGroupDetail,
  CollectionGroupsResponse,
  CollectionLowQualityImagesResponse,
  CollectionResultsOverall,
  CollectionUploadProgress,
  CreateCollectionUploadRequest,
  CreateCollectionUploadResponse,
  UpdateCollectionImageReviewResponse,
} from "@/services/collections/types";

type ListCollectionsResponse = {
  collections: Collection[];
};

type UpdateCollectionNameResponse = {
  collection: {
    id: string;
    name: string;
  };
};

type CollectionUploadProgressOptions = {
  onProgress?: (progress: CollectionUploadProgress) => void;
};

export async function listCollections(): Promise<ListCollectionsResponse> {
  const response = await fetch("/api/collections", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collections",
      response.status,
    );
  }

  return response.json() as Promise<ListCollectionsResponse>;
}

export async function getCollectionsSummary(): Promise<CollectionsSummary> {
  const response = await fetch("/api/collections/summary", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collections summary",
      response.status,
    );
  }

  return response.json() as Promise<CollectionsSummary>;
}

export async function getCollectionResultsOverall(
  collectionId: string,
): Promise<CollectionResultsOverall> {
  const response = await fetch(
    `/api/collections/${collectionId}/results/overall`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collection results",
      response.status,
    );
  }

  return response.json() as Promise<CollectionResultsOverall>;
}

export async function getCollectionProgress(
  collectionId: string,
): Promise<CollectionProgressData> {
  const response = await fetch(`/api/collections/${collectionId}/progress`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collection progress",
      response.status,
    );
  }

  return response.json() as Promise<CollectionProgressData>;
}

export async function listCollectionGroups(
  collectionId: string,
): Promise<CollectionGroupsResponse> {
  const response = await fetch(`/api/collections/${collectionId}/groups`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collection groups",
      response.status,
    );
  }

  return response.json() as Promise<CollectionGroupsResponse>;
}

export async function getCollectionGroup(
  collectionId: string,
  groupId: string,
): Promise<CollectionGroupDetail> {
  const response = await fetch(
    `/api/collections/${collectionId}/groups/${groupId}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load collection group",
      response.status,
    );
  }

  return response.json() as Promise<CollectionGroupDetail>;
}

export async function updateCollectionGroupRepresentative(
  collectionId: string,
  groupId: string,
  representativeImageId: string | null,
): Promise<{ ok: true }> {
  const response = await fetch(
    `/api/collections/${collectionId}/groups/${groupId}/representative`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ representativeImageId }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to update group representative",
      response.status,
    );
  }

  return response.json() as Promise<{ ok: true }>;
}

export async function getCollectionLowQualityImages(
  collectionId: string,
  options: { limit?: number; offset?: number; isSelected?: boolean } = {},
): Promise<CollectionLowQualityImagesResponse> {
  const searchParams = new URLSearchParams();

  if (options.limit !== undefined) {
    searchParams.set("limit", String(options.limit));
  }

  if (options.offset !== undefined) {
    searchParams.set("offset", String(options.offset));
  }

  if (options.isSelected !== undefined) {
    searchParams.set("isSelected", String(options.isSelected));
  }

  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  const response = await fetch(
    `/api/collections/${collectionId}/low-quality${query}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to load low quality images",
      response.status,
    );
  }

  return response.json() as Promise<CollectionLowQualityImagesResponse>;
}

export async function updateCollectionName(
  collectionId: string,
  name: string,
): Promise<UpdateCollectionNameResponse> {
  const response = await fetch(`/api/collections/${collectionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to update collection name",
      response.status,
    );
  }

  return response.json() as Promise<UpdateCollectionNameResponse>;
}

export async function updateCollectionImageReview(
  collectionId: string,
  imageId: string,
  isSelected: boolean,
): Promise<UpdateCollectionImageReviewResponse> {
  const response = await fetch(
    `/api/collections/${collectionId}/images/${imageId}/review`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSelected }),
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionsServiceError(
      data.error ?? "Failed to update image review",
      response.status,
    );
  }

  return response.json() as Promise<UpdateCollectionImageReviewResponse>;
}

export async function createCollectionUpload(
  files: File[],
): Promise<CreateCollectionUploadResponse> {
  const body: CreateCollectionUploadRequest = {
    files: files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    })),
  };

  const response = await fetch("/api/collections/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionUploadError(
      data.error ?? "Collection upload failed",
      response.status,
    );
  }

  return response.json() as Promise<CreateCollectionUploadResponse>;
}

async function putFileToR2(
  file: File,
  upload: CreateCollectionUploadResponse["uploads"][number],
) {
  let response: Response;

  try {
    response = await fetch(upload.url, {
      method: upload.method,
      headers: upload.headers,
      body: file,
    });
  } catch {
    throw new CollectionUploadStorageError(
      `Failed to upload ${file.name}. Check R2 bucket CORS allows PUT from this origin.`,
    );
  }

  if (!response.ok) {
    throw new CollectionUploadStorageError(
      `Failed to upload ${file.name} (${response.status})`,
    );
  }
}

export async function uploadCollectionFilesToStorage(
  files: File[],
  collectionUpload: CreateCollectionUploadResponse,
  options?: CollectionUploadProgressOptions,
): Promise<void> {
  if (files.length !== collectionUpload.uploads.length) {
    throw new CollectionUploadStorageError(
      "Collection upload does not match selected files",
    );
  }

  const total = files.length;
  let completed = 0;

  await Promise.all(
    files.map(async (file, index) => {
      const upload = collectionUpload.uploads[index];
      await putFileToR2(file, upload);
      completed += 1;
      options?.onProgress?.({
        completed,
        total,
        fileName: file.name,
      });
    }),
  );
}

async function completeCollectionUpload(
  collectionUpload: CreateCollectionUploadResponse,
): Promise<void> {
  const response = await fetch(`/api/collections/${collectionUpload.collectionId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileIds: collectionUpload.uploads.map((upload) => upload.fileId),
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
    };

    throw new CollectionUploadError(
      data.error ?? "Failed to complete collection upload",
      response.status,
    );
  }
}

export async function uploadCollection(
  files: File[],
  options?: CollectionUploadProgressOptions,
): Promise<CreateCollectionUploadResponse> {
  const collectionUpload = await createCollectionUpload(files);
  await uploadCollectionFilesToStorage(files, collectionUpload, options);
  await completeCollectionUpload(collectionUpload);
  return collectionUpload;
}
