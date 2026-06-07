import { notFound } from "next/navigation";

import { GroupsPage } from "@/components/collections/results/groups/groups-page";
import { isUuid } from "@/services/collections";

type ResultsGroupsPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function DashboardCollectionResultsGroupsPage({
  params,
}: ResultsGroupsPageProps) {
  const { collectionId } = await params;

  if (!isUuid(collectionId)) {
    notFound();
  }

  return <GroupsPage collectionId={collectionId} />;
}
