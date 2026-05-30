import { Check, Images, Layers3, ShieldAlert } from "lucide-react";

import type { BatchProgressData, ProgressStat } from "@/components/progress/types";

export function getMockBatchProgress(batchId: string): BatchProgressData {
  return {
    batchId,
    title: "Italy Trip 2024",
    uploadedAt: "May 14, 2024",
    status: "PROCESSING",
    totalPhotos: 143,
    processedPhotos: 82,
    failedPhotos: 0,
    progress: 68,
    estimatedRemaining: "4 minutes",
    lowQualityDetected: 19,
    similarGroupsFound: 11,
    stages: [
      {
        label: "Detecting blurry and out-of-focus photos",
        status: "completed",
      },
      {
        label: "Extracting image features",
        status: "completed",
      },
      {
        label: "Grouping similar photos",
        status: "in progress",
      },
      {
        label: "Scoring and selecting best photos",
        status: "pending",
      },
    ],
    activity: [
      "IMG_1023.JPG marked as blurry",
      "Group 7 created with 6 similar photos",
      "Best photo selected for Group 4",
      "IMG_1088.JPG passed exposure checks",
    ],
    tasks: [
      "Detecting blurry and out-of-focus photos",
      "Grouping similar photos",
      "Scoring and selecting best photos",
    ],
  };
}

export function getProgressStats(data: BatchProgressData): ProgressStat[] {
  return [
    { label: "Total Photos", value: String(data.totalPhotos), icon: Images },
    { label: "Processed", value: String(data.processedPhotos), icon: Check },
    {
      label: "Low Quality Detected",
      value: String(data.lowQualityDetected),
      icon: ShieldAlert,
    },
    {
      label: "Similar Groups Found",
      value: String(data.similarGroupsFound),
      icon: Layers3,
    },
  ];
}
