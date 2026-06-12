import { notFound } from "next/navigation";

import { GroupDetailPage } from "@/components/collections/results/groups/group-detail-page";
import { isUuid } from "@/services/collections";

type ResultsGroupDetailPageProps = {
  params: Promise<{ collectionId: string; groupId: string }>;
};

export default async function DashboardCollectionResultsGroupDetailPage({
  params,
}: ResultsGroupDetailPageProps) {
  const { collectionId, groupId } = await params;

  if (!isUuid(collectionId) || !isUuid(groupId)) {
    notFound();
  }

  return <GroupDetailPage collectionId={collectionId} groupId={groupId} />;
}
