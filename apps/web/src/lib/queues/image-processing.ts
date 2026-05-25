import "server-only";

import { Queue } from "bullmq";

const DEFAULT_IMAGE_PROCESSING_QUEUE_NAME = "image-processing";

export const IMAGE_PROCESSING_QUEUE_NAME =
  process.env.IMAGE_WORKER_QUEUE ?? DEFAULT_IMAGE_PROCESSING_QUEUE_NAME;

export type ImageProcessingJobData = {
  message: string;
  sessionId: string;
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

export async function enqueueImageProcessingJob(sessionId: string) {
  const queue = getImageProcessingQueue();

  return queue.add(
    "process-upload-session",
    {
      message: `Process upload session ${sessionId}`,
      sessionId,
    },
    { removeOnComplete: true },
  );
}
