# Cullify Image Worker

Placeholder Python worker for Cullify image processing.

This package is intentionally light for now. It establishes the standard project
shape for the future processing service without adding blur detection,
thumbnailing, embeddings, or queue-processing behavior yet.

## Structure

```text
workers/image_processor/
├── pyproject.toml
├── README.md
├── src/
│   └── cullify_worker/
│       ├── __init__.py
│       ├── __main__.py
│       ├── config.py
│       ├── worker.py
│       └── processing/
│           ├── __init__.py
│           └── pipeline.py
└── tests/
    └── test_placeholder.py
```

## Local Setup

```bash
cd workers/image_processor
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e .
```

## Run

```bash
cullify-image-worker
```

For now, the worker only starts the placeholder app and exits cleanly.

## Test

```bash
python -m unittest discover -s tests
```

