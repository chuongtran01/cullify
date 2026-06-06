import { notFound } from "next/navigation";

import { getMockReviewResults } from "@/components/results/overall/mock-data";
import { ReviewResultsView } from "@/components/results/overall/review-results-view";
import { isUuid } from "@/services/collections";

type ResultsPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function DashboardCollectionResultsPage({
  params,
}: ResultsPageProps) {
  const { collectionId } = await params;

  if (!isUuid(collectionId)) {
    notFound();
  }

  const data = getMockReviewResults(collectionId);

  return <ReviewResultsView data={data} />;
}
