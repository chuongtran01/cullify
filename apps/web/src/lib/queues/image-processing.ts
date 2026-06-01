import "server-only";

import { Queue } from "bullmq";

const DEFAULT_IMAGE_PROCESSING_QUEUE_NAME = "image-processing";

export const IMAGE_PROCESSING_QUEUE_NAME =
  process.env.IMAGE_WORKER_QUEUE ?? DEFAULT_IMAGE_PROCESSING_QUEUE_NAME;
export const PROCESS_COLLECTION_JOB_NAME = "process-collection";

export type ImageProcessingJobData = {
  message: string;
  collectionId: string;
};

const globalForImageProcessingQueue = globalThis as unknown as {
  imageProcessingQueue: Queue<ImageProcessingJobData> | undefined;
};

function createImageProcessingQueue() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is not set");
  }

  return new Queue<ImageProcessingJobData>(IMAGE_PROCESSING_QUEUE_NAME, {
    connection: { url: redisUrl },
  });
}

export function getImageProcessingQueue() {
  globalForImageProcessingQueue.imageProcessingQueue ??=
    createImageProcessingQueue();

  return globalForImageProcessingQueue.imageProcessingQueue;
}

export async function enqueueImageProcessingJob(collectionId: string) {
  const queue = getImageProcessingQueue();

  const job = await queue.add(
    PROCESS_COLLECTION_JOB_NAME,
    {
      message: `Process collection ${collectionId}`,
      collectionId: collectionId,
    },
    { removeOnComplete: true },
  );

  return job;
}
