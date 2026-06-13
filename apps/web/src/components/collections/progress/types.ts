export type ProcessingStageStatus = "completed" | "in progress" | "pending";

export type ProcessingStage = {
  label: string;
  status: ProcessingStageStatus;
};

export type CollectionProgressData = {
  collectionId: string;
  status: string;
  totalPhotos: number;
  processedPhotos: number;
  failedPhotos: number;
  progress: number;
  lowQualityDetected: number;
  similarGroupsFound: number;
  stages: ProcessingStage[];
};
