import { notFound } from "next/navigation";

import { getMockReviewResults } from "@/components/results/mock-data";
import { ReviewResultsView } from "@/components/results/review-results-view";
import { isUuid } from "@/services/collections";

type ResultsPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { collectionId } = await params;

  if (!isUuid(collectionId)) {
    notFound();
  }

  const data = getMockReviewResults(collectionId);

  return <ReviewResultsView data={data} />;
}
