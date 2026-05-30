export type ReviewPhoto = {
  id: string;
  title: string;
  src: string;
  reason?: string;
};

export type SimilarGroup = {
  id: string;
  name: string;
  photoCount: number;
  src: string;
};

export type ReviewProgressItem = {
  label: string;
  completed: number;
  total: number;
};

export type ReviewResultsData = {
  batchId: string;
  title: string;
  uploadedAt: string;
  totalPhotos: number;
  standoutPhotos: ReviewPhoto[];
  similarGroups: SimilarGroup[];
  rejectedPhotos: ReviewPhoto[];
  progress: {
    percent: number;
    items: ReviewProgressItem[];
  };
};

const photoSources = [
  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",
];

export function getMockReviewResults(batchId: string): ReviewResultsData {
  return {
    batchId,
    title: "Italy Trip 2024",
    uploadedAt: "May 24, 2026",
    totalPhotos: 284,
    standoutPhotos: [
      { id: "pick-1", title: "Cliffside overlook", src: photoSources[0] },
      { id: "pick-2", title: "Evening canal", src: photoSources[6] },
      { id: "pick-3", title: "Coastal walk", src: photoSources[3] },
      { id: "pick-4", title: "Old city street", src: photoSources[5] },
      { id: "pick-5", title: "Harbor light", src: photoSources[7] },
    ],
    similarGroups: [
      {
        id: "group-1",
        name: "Amalfi overlook",
        photoCount: 18,
        src: photoSources[0],
      },
      {
        id: "group-2",
        name: "Venice canals",
        photoCount: 14,
        src: photoSources[6],
      },
      {
        id: "group-3",
        name: "Coastal portraits",
        photoCount: 9,
        src: photoSources[3],
      },
      {
        id: "group-4",
        name: "Market details",
        photoCount: 7,
        src: photoSources[4],
      },
    ],
    rejectedPhotos: [
      {
        id: "reject-1",
        title: "Low-light street",
        src: photoSources[1],
        reason: "Blurry",
      },
      {
        id: "reject-2",
        title: "Soft portrait",
        src: photoSources[2],
        reason: "Out of Focus",
      },
      {
        id: "reject-3",
        title: "Group photo",
        src: photoSources[5],
        reason: "Closed Eyes",
      },
      {
        id: "reject-4",
        title: "Night plaza",
        src: photoSources[7],
        reason: "Poor Lighting",
      },
      {
        id: "reject-5",
        title: "Duplicate coast",
        src: photoSources[0],
        reason: "Duplicate",
      },
    ],
    progress: {
      percent: 42,
      items: [
        { label: "AI Picks reviewed", completed: 18, total: 42 },
        { label: "Similar Groups reviewed", completed: 8, total: 31 },
        { label: "Rejected Photos reviewed", completed: 24, total: 86 },
      ],
    },
  };
}
