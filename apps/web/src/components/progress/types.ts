import type { LucideIcon } from "lucide-react";

export type ProcessingStageStatus = "completed" | "in progress" | "pending";

export type ProcessingStage = {
  label: string;
  status: ProcessingStageStatus;
};

export type ProgressStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type BatchProgressData = {
  batchId: string;
  title: string;
  uploadedAt: string;
  status: string;
  totalPhotos: number;
  processedPhotos: number;
  failedPhotos: number;
  progress: number;
  estimatedRemaining: string;
  lowQualityDetected: number;
  similarGroupsFound: number;
  stages: ProcessingStage[];
  activity: string[];
  tasks: string[];
};
