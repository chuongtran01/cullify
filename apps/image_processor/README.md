# Cullify Image Worker

Placeholder Python worker for Cullify image processing.

This package is intentionally light for now. It establishes the standard project
shape for the future processing service without adding blur detection,
thumbnailing, or embeddings. It uses the official BullMQ Python package to
consume queue jobs and passes each job payload into the placeholder pipeline.

## Structure

```text
apps/image_processor/
├── pyproject.toml
├── README.md
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── worker.py
│   └── processor/
│       ├── __init__.py
│       ├── batch_loader.py
│       └── pipeline.py
└── tests/
    └── test_placeholder.py
```

## Local Setup

From the repo root:

```bash
npm run install:worker
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

```bash
cullify-image-worker
```

For now, the worker runs continuously, receives queued messages, and prints each
payload from the placeholder pipeline.

## Process A Message

Start the Next.js app and complete an upload session. The completion API
enqueues a BullMQ job with the upload session id.

Run the worker:

```bash
cullify-image-worker
```

The pipeline should print the queued message. Stop the worker with `Ctrl+C`.

## Test

```bash
python -m unittest discover -s tests
```
