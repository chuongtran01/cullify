import { BatchProgressView } from "@/components/progress/batch-progress-view";
import { getMockBatchProgress } from "@/components/progress/mock-data";
import { getRequestUserId } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { isUuid } from "@/lib/upload/validate";
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

  const userId = await getRequestUserId(await headers());

  if (!userId) {
    notFound();
  }

  const batch = await prisma.batch.findFirst({
    where: { id: batchId, userId },
    select: { id: true },
  });

  if (!batch) {
    notFound();
  }

  const data = getMockBatchProgress(batchId);

  return <BatchProgressView data={data} />;
}
