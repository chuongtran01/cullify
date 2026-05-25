# Cullify Image Worker

Placeholder Python worker for Cullify image processing.

This package is intentionally light for now. It establishes the standard project
shape for the future processing service with a blur score helper, while leaving
thumbnailing and embeddings for later. It uses the official BullMQ Python
package to consume queue jobs and passes each job payload into the placeholder
pipeline.

## Structure

```text
apps/image_processor/
├── pyproject.toml
├── README.md
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── mq/
│   │   ├── consumer.py
│   │   └── message_types.py
│   ├── db/
│   │   ├── session.py
│   │   ├── models/
│   │   │   ├── batch.py
│   │   │   ├── image.py
│   │   │   └── image_quality_analysis.py
│   │   └── repositories/
│   │       ├── batch_repo.py
│   │       └── image_repo.py
│   └── processor/
│       ├── __init__.py
│       ├── batch_loader.py
│       ├── pipeline.py
│       └── quality/
│           └── blur.py
└── tests/
    ├── test_blur.py
    └── test_placeholder.py
```

## Blur Score

For images downloaded from R2, use the bytes helper. It returns a score,
threshold, dimensions, and an `is_blurry` decision:

```python
from image_processor.processor.quality import calculate_blur_score_from_bytes

result = calculate_blur_score_from_bytes(downloaded_image.data)
print(result.score, result.is_blurry)
```

The score is the variance of the Laplacian. Higher values indicate sharper
images; values below the threshold are treated as blurry.

## Local Setup

From the repo root:

```bash
npm run install:image_processor
```

Or from this directory:

```bash
cd apps/image_processor
cp .env.example .env.local
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e .
```

## Run

From the repo root:

```bash
npm run image_processor
```

For now, the processor runs continuously, receives queued messages, and prints each
payload from the placeholder pipeline.

## Process A Message

Start the Next.js app and complete an upload session. The completion API
enqueues a BullMQ job with the upload session id.

Run the image processor:

```bash
npm run image_processor
```

The pipeline should print the queued message. Stop the worker with `Ctrl+C`.

## Test

```bash
python -m unittest discover -s tests
```
