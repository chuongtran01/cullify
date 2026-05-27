import { BatchProgressView } from "@/components/progress/batch-progress-view";
import { getMockBatchProgress } from "@/components/progress/mock-data";

type ProgressPageProps = {
  params: Promise<{ batchId: string }>;
};

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { batchId } = await params;
  const data = getMockBatchProgress(batchId);

  return <BatchProgressView data={data} />;
}
