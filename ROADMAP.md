# Cullify Roadmap

## Roadmap Goal

This roadmap breaks Cullify into a practical build sequence: a focused MVP first, then phases that turn it into a production-ready AI photo culling SaaS.

The guiding product question stays constant:

> Which photos should I keep?

## MVP Definition

The MVP should prove the core product loop:

1. User uploads a batch of photos.
2. The app processes the batch.
3. Similar photos are grouped.
4. Blurry or low-quality photos are flagged.
5. The best shot in each group is recommended.
6. User reviews groups and chooses keep, reject, or favorite.

The MVP does not need full production infrastructure, billing, advanced account management, or perfect AI accuracy. It should feel polished enough to validate the workflow and clear enough to test with real users.

## MVP Scope

### Must Have

- Next.js App Router application shell.
- Responsive landing page.
- Drag-and-drop multi-image upload.
- Upload queue with image thumbnails.
- Mock or real processing progress states.
- Smart gallery grouped by photo clusters.
- Best-shot recommendation per group.
- Blur or quality warning labels.
- Keep, reject, and favorite actions.
- Cluster detail modal for focused comparison.
- Basic settings for culling strictness.
- Local/mock data path for frontend development.

### Should Have

- Keyboard shortcuts for gallery review.
- Quick compare mode.
- Multi-select actions.
- Review progress summary.
- Basic persistence through API/database.
- Basic thumbnail generation.

### Not In MVP

- Billing.
- Team accounts.
- Lightroom export.
- Mobile phone workflow.
- Advanced face analysis.
- Fully optimized large-batch processing.
- Public API.
- Native desktop app.
- Complex storage lifecycle automation.

## Phase 0: Foundation

Purpose: establish the project structure and visual baseline.

Deliverables:

- Next.js App Router scaffold.
- TypeScript configuration.
- Tailwind CSS setup.
- shadcn/ui setup.
- Framer Motion installed.
- TanStack React Query installed.
- Shared app layout.
- Design tokens from `DESIGN.md`.
- Basic reusable UI primitives.

Acceptance Criteria:

- App runs locally with `npm run dev`.
- `npm run lint` passes.
- `npm run build` passes.
- Global styles match the intended cream, ink, and orange direction.

## Phase 1: Product Shell

Purpose: design the main SaaS surfaces with realistic static data.

Deliverables:

- Landing page.
- Upload page.
- Processing/loading page.
- Smart gallery review page.
- Cluster detail modal or route.
- Settings/preferences page.
- Mock project and image cluster data.
- Responsive desktop and tablet layouts.

Acceptance Criteria:

- User can navigate through the full intended workflow.
- Smart gallery visually communicates grouped images and recommendations.
- UI feels premium and specific to photo culling, not like a generic dashboard.
- Desktop and tablet layouts are usable.

## Phase 2: Upload Experience

Purpose: make image ingestion real.

Deliverables:

- Drag-and-drop upload implementation.
- Multi-file validation.
- Upload queue state.
- Client-side image previews.
- File size and format validation.
- Project creation model.
- Initial image records.
- Signed upload URL API, if using object storage.
- Local development fallback for storage, if needed.

Acceptance Criteria:

- User can upload multiple images.
- User sees upload progress and thumbnail previews.
- Invalid files are handled clearly.
- Uploaded files are associated with a project.

## Phase 3: Data And Backend Foundation

Purpose: create durable project, image, and review state.

Deliverables:

- PostgreSQL setup.
- Prisma schema.
- Project model.
- Image model.
- Cluster model.
- Processing job model.
- Review status model.
- API routes for projects, images, clusters, and review actions.
- React Query hooks for app data.

Acceptance Criteria:

- Project and image data persist across refreshes.
- Gallery state is loaded from the API.
- Keep, reject, and favorite actions persist.
- API responses are typed and predictable.

## Phase 4: Processing Pipeline MVP

Purpose: implement the first useful AI processing loop.

Deliverables:

- Background job queue.
- Processing job state machine.
- Python FastAPI processing service.
- OpenCV blur scoring.
- Thumbnail generation.
- Basic image metadata extraction.
- Processing progress updates.
- Result persistence back to database.

Acceptance Criteria:

- Uploaded images are processed asynchronously.
- Blur scores are generated for each image.
- Processing progress is visible in the UI.
- Failed jobs have a retry path.

## Phase 5: Similarity And Clustering

Purpose: group related images and power the smart gallery.

Deliverables:

- OpenCLIP embedding generation.
- FAISS similarity lookup.
- HDBSCAN clustering.
- Cluster confidence score.
- Single-image cluster handling.
- Cluster ordering for review.
- Similarity result persistence.

Acceptance Criteria:

- Similar photos are grouped together with acceptable accuracy.
- Near-duplicates appear in the same cluster.
- Unrelated images do not get forced into bad groups.
- Smart gallery renders real clusters from processing results.

## Phase 6: Best-Shot Recommendation

Purpose: recommend the most keep-worthy photo in each group.

Deliverables:

- Ranking score per image.
- Weighted scoring model.
- Sharpness score integration.
- Aesthetic score placeholder or first implementation.
- Optional face quality score.
- Recommendation reason labels.
- User preference weighting.

Acceptance Criteria:

- Each multi-image cluster has a recommended best shot.
- Recommendation appears pinned or emphasized in the gallery.
- User can understand why a photo was recommended.
- Ranking can be tuned without rewriting gallery UI.

## Phase 7: Review Workflow Polish

Purpose: make the core review experience fast and delightful.

Deliverables:

- Keyboard shortcuts.
- Quick compare mode.
- Multi-select actions.
- Accept AI recommendation action.
- Reject all non-selected in cluster action.
- Review progress summary.
- Filter by undecided, kept, rejected, favorite, blurry, or recommended.
- Smooth Framer Motion transitions.

Acceptance Criteria:

- User can review a batch quickly without excessive clicking.
- Core actions are available from both gallery and cluster detail views.
- Keyboard shortcuts are discoverable and reliable.
- UI remains responsive with realistic batch sizes.

## Phase 8: Production Readiness

Purpose: prepare the product for real users.

Deliverables:

- Authentication.
- Account settings.
- Usage limits.
- Billing plan hooks.
- Object storage lifecycle rules.
- Privacy and deletion controls.
- Job observability.
- Error reporting.
- Rate limiting.
- Performance testing.
- Security review.

Acceptance Criteria:

- Users can safely manage their own projects.
- Private images are protected.
- Deleted images are removed according to policy.
- Processing failures are observable and recoverable.
- The system handles expected MVP batch sizes reliably.

## Suggested Build Order

1. Phase 0: Foundation.
2. Phase 1: Product Shell.
3. Phase 2: Upload Experience.
4. Phase 3: Data And Backend Foundation.
5. Phase 4: Processing Pipeline MVP.
6. Phase 5: Similarity And Clustering.
7. Phase 6: Best-Shot Recommendation.
8. Phase 7: Review Workflow Polish.
9. Phase 8: Production Readiness.

## First Milestone

The first milestone should be a clickable, polished frontend prototype with mock data:

- Landing page.
- Upload page.
- Processing page.
- Smart gallery page.
- Cluster detail modal.
- Settings page.

This milestone validates the product experience before investing heavily in AI infrastructure.

## Second Milestone

The second milestone should make upload and review state real:

- Real image upload.
- Persisted projects.
- Persisted image records.
- Persisted review decisions.
- Gallery driven by backend data.

This milestone validates the app workflow and data model.

## Third Milestone

The third milestone should make AI processing useful:

- Blur detection.
- Thumbnail generation.
- Similarity grouping.
- Best-shot recommendation.
- Processing progress.

This milestone validates Cullify's core product promise.

## Risks

- Image processing can become slow for large batches.
- Similarity grouping quality may need tuning across different photography styles.
- Face analysis introduces privacy and dependency complexity.
- Storage costs can grow quickly with original uploads and derivatives.
- Users may need export workflows earlier than expected.

## Product Validation Questions

- Do users trust the recommended best shot?
- Does grouping reduce review time meaningfully?
- Are blur and quality flags accurate enough to be helpful?
- What is the ideal number of recommendations per group?
- Do users want destructive delete actions or non-destructive reject lists?
- Which export workflow matters first?
