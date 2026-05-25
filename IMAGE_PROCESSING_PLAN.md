# Cullify Image Processing Plan

This document defines the first durable plan for Cullify's two core processing
features:

- Image quality filtering.
- Similar-shot grouping for review.

The goal is to keep the database stable while allowing the ML implementation to
evolve. Store product-facing outputs in structured columns, and keep raw or
model-specific details in JSON or vector storage until the signals prove stable.

## Feature 1: Image Quality Filtering

Quality filtering should not be a single pass/fail value. Each image should get
separate technical signals that can be shown, tuned, and combined into an
overall recommendation.

Initial quality flags:

- Blurry.
- Out of focus.
- Motion blur.
- Eyes closed.
- Low exposure.
- Compression artifacts.

Recommended MVP order:

1. Blur scoring.
2. Exposure scoring.
3. Basic compression heuristics.
4. Face and eye-open scoring.
5. Motion blur and more advanced focus scoring.

Blur and exposure are the best first signals because they can be implemented
without face models or heavier ML dependencies.

## Feature 2: Similar-Shot Grouping

Grouping should help users compare photos that are meaningfully substitutable:
same moment, same subject, similar frame, or similar pose.

Grouping signals:

- Same pose.
- Same person positioning.
- Same background.
- Same composition.
- Same facial expression.
- Same camera angle.

These should be treated as similarity features, not as separate user-facing
cluster types yet. The durable product output is the cluster membership:

- These images belong together.
- This image is recommended.
- This cluster has a confidence score.
- Each image has a rank inside the cluster.

## Recommended Database Shape

Use separate tables for image records, quality analysis, embeddings, clusters,
and cluster membership.

```prisma
model ImageQualityAnalysis {
  id                       String   @id @default(uuid())
  imageId                  String   @unique
  image                    Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)

  blurScore                Float?
  focusScore               Float?
  motionBlurScore          Float?
  eyeClosedScore           Float?
  exposureScore            Float?
  compressionScore         Float?
  overallQualityScore      Float?

  isBlurry                 Boolean  @default(false)
  isOutOfFocus             Boolean  @default(false)
  hasMotionBlur            Boolean  @default(false)
  hasEyesClosed            Boolean  @default(false)
  isLowExposure            Boolean  @default(false)
  hasCompressionArtifacts  Boolean  @default(false)

  flags                    Json?
  raw                      Json?

  analyzedAt               DateTime?
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}

model ImageEmbedding {
  id          String   @id @default(uuid())
  imageId     String   @unique
  image       Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)

  model       String
  version     String?
  dimension   Int

  vectorRef   String?
  raw         Json?

  createdAt   DateTime @default(now())
}

model ImageCluster {
  id          String      @id @default(uuid())
  sessionId   String

  type        ClusterType @default(SIMILAR_SHOT)
  label       String?
  confidence  Float?
  size        Int         @default(0)
  raw         Json?

  images      ClusterImage[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([sessionId])
}

model ClusterImage {
  id              String       @id @default(uuid())
  clusterId       String
  imageId         String

  cluster         ImageCluster @relation(fields: [clusterId], references: [id], onDelete: Cascade)
  image           Image        @relation(fields: [imageId], references: [id], onDelete: Cascade)

  similarityScore Float?
  qualityScore    Float?
  rank            Int?
  isRecommended   Boolean      @default(false)
  reason          String?

  createdAt       DateTime     @default(now())

  @@unique([clusterId, imageId])
  @@index([imageId])
  @@index([clusterId, rank])
}

enum ClusterType {
  SIMILAR_SHOT
  DUPLICATE
  SINGLETON
}
```

For the current schema, `sessionId` maps to the upload batch id. If the product
renames upload sessions to batches or projects later, keep the cluster relation
attached to that durable batch/project entity rather than to a transient job.

## Worker Pipeline

The Python worker should receive a BullMQ job with a `sessionId`, then load the
images for that session from the database.

Recommended pipeline:

```text
process_upload_session(sessionId)
  load completed images for session
  for each image:
    download original from R2
    decode image
    extract metadata
    run quality analysis
    persist ImageQualityAnalysis
    generate embedding/features
    persist ImageEmbedding
  cluster images for session
  persist ImageCluster rows
  persist ClusterImage rows
  rank images inside each cluster
  mark recommended image per cluster
```

Recommended worker package shape:

```text
workers/image_processor/src/cullify_worker/
├── jobs.py
├── worker.py
├── processing/
│   ├── pipeline.py
│   ├── quality/
│   │   ├── analyzer.py
│   │   ├── blur.py
│   │   ├── exposure.py
│   │   ├── faces.py
│   │   ├── focus.py
│   │   ├── motion.py
│   │   ├── compression.py
│   │   └── scoring.py
│   ├── similarity/
│   │   ├── embeddings.py
│   │   ├── clustering.py
│   │   ├── features.py
│   │   └── ranking.py
│   ├── database.py
│   └── storage.py
```

## Signal Strategy

Quality signals:

- Blur: variance of Laplacian or similar sharpness metric.
- Out of focus: subject/center-weighted sharpness, later face-region sharpness.
- Motion blur: directional blur or streak detection.
- Eyes closed: face landmarks or eye-open model.
- Low exposure: luminance histogram, clipping, and face/subject exposure.
- Compression artifacts: JPEG metadata, blockiness, and high-frequency artifact heuristics.

Similarity signals:

- Visual embedding similarity for overall content.
- Pose/person-position features for subject placement.
- Background/scene embedding similarity.
- Composition features such as crop, horizon, and subject location.
- Face/expression features when face analysis is enabled.
- Timestamp proximity as a weak clue for burst or same-moment photos.

## Implementation Phases

### Phase A: Data Foundation

- Add `ImageQualityAnalysis`.
- Add `ImageEmbedding`.
- Add `ImageCluster`.
- Add `ClusterImage`.
- Add a processing job state model if progress needs to persist independently.

### Phase B: Quality MVP

- Worker loads images by `sessionId`.
- Compute blur score.
- Compute exposure score.
- Persist quality scores and flags.
- Surface flags in API/UI.

### Phase C: Similarity MVP

- Generate image embeddings.
- Cluster images within a session.
- Persist clusters and memberships.
- Render real grouped gallery data.

### Phase D: Ranking

- Compute per-image quality score.
- Rank images inside each cluster.
- Mark one recommended image.
- Persist recommendation reasons.

### Phase E: Advanced Signals

- Add eye-open/facial expression analysis.
- Add motion blur detection.
- Add compression artifact detection.
- Tune thresholds by image size, camera type, and user preference.

## Product Rules

- Do not hide bad photos by default. Flag them and make review faster.
- Treat singletons as valid clusters, not failures.
- Keep recommendations explainable with simple labels.
- Keep raw model outputs out of the main `Image` row.
- Let the UI depend on stable cluster/ranking/flag outputs, not raw ML internals.

