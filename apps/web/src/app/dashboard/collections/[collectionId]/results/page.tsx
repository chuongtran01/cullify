import { notFound } from "next/navigation";

import { ReviewResultsView } from "@/components/collections/results/overall/review-results-view";
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

  return <ReviewResultsView collectionId={collectionId} />;
}
