# Cullify High-Level Project Plan

## Product Vision

Cullify is a premium, AI-first photo culling SaaS that helps users answer one question quickly:

> Which photos should I keep?

The product lets users upload batches of images, automatically identifies blurry or low-quality photos, groups visually similar shots, and recommends the best photo or photos from each group. The experience should reduce decision fatigue and turn large photo batches into fast, confident keep/delete decisions.

## Target Experience

Cullify should feel minimal, calm, and production-grade. The core interaction is not a generic dashboard; it is an image review workflow built around large previews, grouped stacks, AI recommendations, fast actions, and keyboard-driven selection.

The ideal user flow:

1. Upload images.
2. AI analyzes image quality and similarity.
3. Similar photos are grouped automatically.
4. Blurry or low-quality images are flagged.
5. Best shots are highlighted.
6. User quickly accepts, rejects, favorites, or compares final photos.

## Core Features

- Drag-and-drop multi-image upload.
- Fast image processing pipeline.
- Automatic blur and out-of-focus detection.
- Duplicate and near-duplicate detection.
- Semantic grouping of similar photos by pose, background, composition, or scene.
- Best shot recommendation per group.
- Grid/gallery interface with grouped image stacks.
- Keep, delete, and favorite states.
- Progress states during AI processing.
- Responsive desktop and tablet design.
- Quick compare mode.
- Keyboard shortcuts.
- Multi-select actions.

## AI And ML Capabilities

- Blur detection.
- Face quality analysis.
- Similarity detection using image embeddings.
- Clustering of related photos.
- Aesthetic scoring.
- Best image ranking.

## Pages And Core Surfaces

### Landing Page

Purpose: communicate the product promise, show the upload-to-review workflow, and establish a premium AI-first brand.

Key sections:

- Hero with direct value proposition.
- Product workflow preview.
- AI capability highlights.
- Smart gallery preview.
- CTA to start upload.

### Upload Page

Purpose: provide a low-friction batch upload experience.

Key features:

- Drag-and-drop multi-image uploader.
- File picker fallback.
- Upload queue with thumbnail previews.
- File validation and duplicate file warnings.
- Batch size and storage guidance.
- Clear call to begin analysis.

### Processing Page

Purpose: make AI work feel fast, transparent, and trustworthy.

Key features:

- Processing progress indicator.
- Stage-based status updates.
- AI action timeline.
- Thumbnail stream or subtle batch preview.
- Estimated remaining time.
- Failure and retry states.

Processing stages:

- Uploading images.
- Extracting metadata.
- Detecting blur.
- Generating embeddings.
- Grouping similar photos.
- Ranking best shots.
- Preparing gallery.

### Smart Gallery Review Page

Purpose: provide the core product experience for deciding what to keep.

Key features:

- Clustered photo groups.
- Recommended image pinned first.
- Similar images stacked behind or beside the recommendation.
- Blur and quality flags.
- Keep, reject, favorite, and compare actions.
- Quick compare mode.
- Multi-select actions.
- Keyboard shortcuts.
- Filter by status, quality, group size, or recommendation.
- Review progress summary.

Primary user question:

> Which photo from this group should I keep?

### Cluster Detail Modal Or Page

Purpose: support focused comparison within one group.

Key features:

- Large selected image preview.
- Side-by-side or filmstrip comparison.
- AI scoring details.
- Blur, face quality, duplicate, and aesthetic signals.
- Keep/reject/favorite controls.
- Keyboard navigation.
- Ability to accept the recommendation and move to next cluster.

### Settings And Preferences Page

Purpose: let users tune review behavior and account preferences.

Key settings:

- Culling strictness.
- Number of recommended images per group.
- Blur sensitivity.
- Face quality weighting.
- Aesthetic scoring preference.
- Storage/export preferences.
- Account and billing settings.

## Recommended Technical Stack

### Frontend

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Framer Motion.
- TanStack React Query.

### Backend

- Next.js API routes for product API surface.
- PostgreSQL for durable relational data.
- Prisma ORM for schema and database access.
- Redis-backed queue for background image processing jobs.

### Storage

- AWS S3 or Cloudflare R2 for original images, thumbnails, and processed derivatives.

### AI Processing Service

- Python FastAPI service.
- OpenCV for blur and image quality analysis.
- OpenCLIP embeddings for semantic similarity.
- FAISS vector search for nearest-neighbor lookup.
- HDBSCAN for clustering related images.
- InsightFace as an optional face quality layer.

## System Architecture

At a high level, Cullify should use a split application and processing architecture:

- Next.js app handles UI, auth, upload orchestration, review workflow, and product APIs.
- Object storage holds uploaded image originals, thumbnails, and generated previews.
- PostgreSQL stores users, projects, images, clusters, scores, and review decisions.
- Redis queue coordinates async AI jobs.
- Python processing service performs image analysis, embeddings, clustering, and ranking.

Recommended flow:

1. User creates a project and uploads images.
2. Next.js API creates image records and signed upload URLs.
3. Client uploads files directly to object storage.
4. Backend enqueues processing jobs.
5. Python service downloads images or reads from storage.
6. Service generates thumbnails, quality scores, embeddings, clusters, and rankings.
7. Results are written back to PostgreSQL.
8. Client receives progress updates and renders grouped gallery.

## Core Data Model

Initial entities:

- `User`: account owner.
- `Project`: one photo culling batch.
- `Image`: uploaded photo with metadata, storage keys, quality scores, and review state.
- `Cluster`: group of related images.
- `ClusterImage`: join model for image order, score, and recommendation status.
- `ProcessingJob`: async job state and progress.
- `Preference`: user or project-level culling settings.

Important image fields:

- Original storage key.
- Thumbnail storage key.
- Width and height.
- File size.
- EXIF timestamp.
- Blur score.
- Face quality score.
- Aesthetic score.
- Embedding reference or vector id.
- Review status: undecided, keep, reject, favorite.
- Recommendation rank.

## Smart Gallery Behavior

The smart gallery is the heart of the product.

Cluster card behavior:

- The best recommended photo appears first and visually emphasized.
- Similar photos are grouped behind it as a stack, grid, or compact strip.
- Bad photos are visibly flagged but not hidden by default.
- Users can accept the recommended keep selection with one action.
- Users can open a focused comparison view for uncertain groups.

Review actions:

- Keep.
- Reject.
- Favorite.
- Accept AI recommendation.
- Compare.
- Select all similar.
- Delete rejected.

Keyboard shortcuts:

- Next cluster.
- Previous cluster.
- Keep selected.
- Reject selected.
- Favorite selected.
- Open compare mode.
- Accept recommendation.

## Processing And Ranking Strategy

### Blur Detection

Use OpenCV-based sharpness scoring as the first quality signal. Start with variance of Laplacian and tune thresholds by image size and content.

### Similarity Detection

Generate embeddings with OpenCLIP and use FAISS for similarity lookup. Combine embedding distance with metadata clues such as timestamp proximity to improve grouping.

### Clustering

Use HDBSCAN to group visually related photos without requiring a fixed cluster count. Treat low-confidence or isolated images as single-image clusters.

### Best Shot Ranking

Rank each image within a cluster using a weighted score:

- Sharpness.
- Face quality.
- Aesthetic quality.
- Exposure or technical quality.
- Duplicate distance from stronger images.
- User preference weighting.

The recommendation should be explainable in simple UI terms, such as "sharpest face", "best composition", or "least blur".

## UX Principles

- Reduce decision fatigue.
- Make the AI recommendation obvious but not forceful.
- Keep controls close to the image being reviewed.
- Favor large image previews over dense tables.
- Use calm progress states so processing feels transparent.
- Make bulk actions reversible where possible.
- Support keyboard-first review for speed.
- Keep advanced scoring details available but secondary.

## Design Direction

Use the visual system in `DESIGN.md` as the product baseline:

- Warm cream canvas.
- Warm ink text.
- Sparse Cursor Orange CTAs.
- Hairline-only depth.
- Minimal premium SaaS aesthetic.
- Code and AI timeline surfaces where appropriate.
- No generic analytics-dashboard framing for the core workflow.

## Implementation Phases

### Phase 1: Frontend Product Shell

- App layout and navigation.
- Landing page.
- Upload page.
- Mock processing page.
- Mock smart gallery with sample clusters.
- Cluster detail modal.
- Settings page.
- Shared design tokens and UI components.

### Phase 2: Upload And Storage Foundation

- Project creation.
- Multi-image upload flow.
- Signed upload URLs.
- Object storage integration.
- Image metadata records.
- Thumbnail generation path.

### Phase 3: Processing Pipeline

- Redis queue.
- Processing job state machine.
- Python FastAPI analysis service.
- Blur scoring.
- Embedding generation.
- Similarity lookup.
- Clustering.
- Result persistence.

### Phase 4: Smart Gallery Review

- Real cluster rendering.
- Recommendation ranking.
- Review state persistence.
- Keep/reject/favorite actions.
- Compare mode.
- Keyboard shortcuts.
- Bulk actions.

### Phase 5: Production Readiness

- Authentication.
- Billing and usage limits.
- Error handling and retries.
- Observability.
- Rate limits.
- Storage lifecycle policies.
- Privacy and deletion controls.
- Performance tuning for large batches.

## MVP Scope

The first useful MVP should include:

- Upload a batch of images.
- Show upload and processing progress.
- Detect blurry images.
- Group visually similar photos.
- Recommend one best shot per group.
- Let users keep, reject, and favorite photos.
- Review grouped photos in a responsive smart gallery.

## Open Questions

- Should Cullify target photographers, everyday consumers, or teams first?
- Should images be permanently stored, temporarily processed, or user-configurable?
- What is the first supported export workflow: delete list, selected image download, Lightroom-compatible metadata, or folder sync?
- Should face analysis be included in the MVP or deferred?
- What batch size should the MVP optimize for?
- Should processing happen fully in the cloud, locally, or hybrid later?
