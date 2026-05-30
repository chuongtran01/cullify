import { notFound } from "next/navigation";

import { getMockReviewResults } from "@/components/results/mock-data";
import { ReviewResultsView } from "@/components/results/review-results-view";
import { isUuid } from "@/lib/upload/validate";

type ResultsPageProps = {
  params: Promise<{ batchId: string }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { batchId } = await params;

  if (!isUuid(batchId)) {
    notFound();
  }

  const data = getMockReviewResults(batchId);

  return <ReviewResultsView data={data} />;
}
