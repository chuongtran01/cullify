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

## `flags` And `raw` Examples

Use stable score and boolean columns for product behavior. Use `flags` for the
UI-friendly list of quality issues. Use `raw` for detector/model details that
are useful for debugging, tuning, and future migrations.

Example `ImageQualityAnalysis` row:

```json
{
  "blurScore": 0.82,
  "focusScore": 0.31,
  "motionBlurScore": 0.44,
  "eyeClosedScore": 0.0,
  "exposureScore": 0.28,
  "compressionScore": 0.16,
  "overallQualityScore": 0.42,
  "isBlurry": true,
  "isOutOfFocus": true,
  "hasMotionBlur": false,
  "hasEyesClosed": false,
  "isLowExposure": true,
  "hasCompressionArtifacts": false
}
```

Example `flags` JSON:

```json
[
  {
    "code": "blurry",
    "label": "Blurry",
    "severity": "high",
    "score": 0.82,
    "reason": "Low sharpness across the frame"
  },
  {
    "code": "out_of_focus",
    "label": "Out of focus",
    "severity": "medium",
    "score": 0.69,
    "reason": "Subject region is softer than expected"
  },
  {
    "code": "low_exposure",
    "label": "Low exposure",
    "severity": "medium",
    "score": 0.72,
    "reason": "Large shadow area and low mean luminance"
  }
]
```

`flags` is meant for UI/API consumption. The UI can render badges from it
without knowing model internals.

Example `raw` JSON:

```json
{
  "version": "quality-mvp-1",
  "image": {
    "width": 4032,
    "height": 3024,
    "channels": 3
  },
  "blur": {
    "method": "variance_of_laplacian",
    "laplacianVariance": 84.2,
    "threshold": 120,
    "normalizedScore": 0.82
  },
  "focus": {
    "method": "center_weighted_sharpness",
    "centerSharpness": 0.29,
    "edgeSharpness": 0.34,
    "subjectRegionSharpness": null
  },
  "exposure": {
    "method": "luminance_histogram",
    "meanLuminance": 0.28,
    "shadowClippingRatio": 0.18,
    "highlightClippingRatio": 0.01,
    "threshold": 0.35
  },
  "faces": [
    {
      "box": [920, 540, 1420, 1180],
      "confidence": 0.97,
      "leftEyeOpenProbability": 0.94,
      "rightEyeOpenProbability": 0.91
    }
  ],
  "compression": {
    "format": "jpeg",
    "estimatedQuality": 87,
    "blockinessScore": 0.12
  }
}
```

`raw` should not drive core UI directly. If a raw field becomes important for
filtering, ranking, or product display, promote it into a structured column in a
later migration.

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
apps/image_processor/src/
├── mq/
│   ├── consumer.py
│   └── message_types.py
├── processor/
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
│   ├── db/
│   │   ├── session.py
│   │   ├── models/
│   │   └── repositories/
│   │       ├── batch_repo.py
│   │       └── image_repo.py
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
