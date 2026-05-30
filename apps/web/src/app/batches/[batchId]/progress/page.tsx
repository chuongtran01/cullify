import { BatchProgressView } from "@/components/progress/batch-progress-view";
import type { BatchProgressData } from "@/components/progress/types";
import { isUuid } from "@/lib/upload/validate";
import {
  getBatchProgress,
  ProgressServiceError,
} from "@/services/progress";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type ProgressPageProps = {
  params: Promise<{ batchId: string }>;
};

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { batchId } = await params;

  if (!isUuid(batchId)) {
    notFound();
  }

  let data: BatchProgressData;

  try {
    data = await getBatchProgress(batchId, {
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof ProgressServiceError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return <BatchProgressView data={data} />;
}
