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
- High exposure.
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
group types yet. The durable product output is the group membership:

- These images belong together.
- This group needs a user-selected representative.
- This image is part of the final selected set.
- This image was excluded because it is low quality, part of a similar group, or
  explicitly changed by the user.

Similarity grouping should focus on viable photos only. Low-quality images and
images with quality-analysis errors should be excluded from similarity grouping
and sent to the low-quality review workflow instead. This keeps the similar-group
workflow focused on choosing the best photo from usable alternatives.

## Recommended Database Shape

Use separate tables for image records, quality analysis, embeddings, similarity
groups, and review decisions. Group membership lives on `Image.groupId` so each
image can belong to at most one similar group without a join table.

```prisma
model Image {
  id           String      @id @default(uuid())
  collectionId String
  groupId      String?
  group        ImageGroup? @relation(fields: [groupId], references: [id], onDelete: SetNull)

  @@index([collectionId])
  @@index([groupId])
}

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
  isHighExposure           Boolean  @default(false)
  hasCompressionArtifacts  Boolean  @default(false)

  analysisError            String?
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
  embeddingError String?
  raw         Json?

  embeddedAt  DateTime?
  createdAt   DateTime @default(now())
}

model ImageGroup {
  id           String   @id @default(uuid())
  collectionId String
  imageCount   Int
  images       Image[]

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([collectionId])
}

model CollectionImageReview {
  id             String               @id @default(uuid())
  collectionId   String
  imageId        String               @unique
  isSelected     Boolean              @default(false)
  decisionSource ReviewDecisionSource @default(DEFAULT)
  decisionReason ReviewDecisionReason
  reviewedAt     DateTime?
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  @@index([collectionId])
  @@index([decisionSource])
  @@index([decisionReason])
  @@index([isSelected])
}

enum ReviewDecisionSource {
  DEFAULT
  USER
}

enum ReviewDecisionReason {
  GOOD_STANDALONE
  LOW_QUALITY
  SIMILAR_GROUP
}
```

For the current schema, `collectionId` maps to the upload collection id. If the product
renames upload collections to collections or projects later, keep the group relation
attached to that durable collection/project entity rather than to a transient job.

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
  "isHighExposure": false,
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

The Python worker should receive a BullMQ job with a `collectionId`, then load the
uploaded images for that collection from the database.

Recommended pipeline:

```text
process_collection(collectionId)
  load uploaded images for collection
  for each image:
    download original from R2
    decode image
    run quality analysis
    persist ImageQualityAnalysis
    generate embedding
    persist ImageEmbedding
  find viable images:
    analyzed successfully
    no analysisError
    no low-quality flags
  group viable images by embedding similarity
  persist ImageGroup rows
  assign Image.groupId for images in multi-image groups
  create CollectionImageReview defaults:
    good standalone/singleton images -> selected
    low-quality or analysis-error images -> unselected
    similar-group images -> unselected until user chooses
  mark collection READY_FOR_REVIEW
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
│   │   └── grouping.py
├── db/
│   ├── session.py
│   ├── models/
│   └── repositories/
│       ├── collection_repo.py
│       ├── image_repo.py
│       ├── image_quality_analysis_repo.py
│       ├── image_embedding_repo.py
│       ├── image_group_repo.py
│       └── collection_image_review_repo.py
└── storage/
    └── r2_client.py
```

## Signal Strategy

Quality signals:

- Blur: variance of Laplacian or similar sharpness metric.
- Out of focus: subject/center-weighted sharpness, later face-region sharpness.
- Motion blur: directional blur or streak detection.
- Eyes closed: face landmarks or eye-open model.
- Low/high exposure: luminance histogram, clipping, and face/subject exposure.
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
- Add `ImageGroup`.
- Add `CollectionImageReview`.
- Add a processing job state model if progress needs to persist independently.

### Phase B: Quality MVP

- Worker loads images by `collectionId`.
- Compute blur score.
- Compute exposure score.
- Persist quality scores and flags.
- Surface flags in API/UI.

### Phase C: Similarity MVP

- Generate image embeddings.
- Exclude low-quality and analysis-error images from grouping.
- Group viable images within a collection.
- Persist multi-image groups and assign `Image.groupId` memberships.
- Render real grouped gallery data.

### Phase D: Review Decisions

- Create one `CollectionImageReview` row per uploaded image.
- Default good standalone/singleton photos to selected.
- Default low-quality and analysis-error photos to unselected.
- Default similar-group photos to unselected until the user chooses.
- Persist user overrides with `decisionSource = USER` and `reviewedAt`.

### Phase E: Advanced Signals

- Add eye-open/facial expression analysis.
- Add motion blur detection.
- Add compression artifact detection.
- Tune thresholds by image size, camera type, and user preference.

## Product Rules

- Do not put low-quality or analysis-error photos into similarity groups.
- Send low-quality photos to a rescue/review workflow where users can keep exceptions.
- Treat singleton similarity results as standalone photos in review; do not persist
  singleton `ImageGroup` rows.
- Keep recommendations explainable with simple labels.
- Keep raw model outputs out of the main `Image` row.
- Let the UI depend on stable group/review/flag outputs, not raw ML internals.
- Keep AI signals separate from user decisions: quality lives in
  `ImageQualityAnalysis`, grouping lives in `ImageGroup`/`Image.groupId`, and final
  inclusion lives in `CollectionImageReview`.
