# Cullify

AI-first photo culling — upload batches, detect blur and duplicates, group similar shots, and pick the best photos faster.

## Repository layout

```
cullify-app/
├── docker-compose.yml   # PostgreSQL + Redis (local dev)
├── apps/
│   └── web/             # Next.js app (UI, API routes, Prisma)
└── workers/             # Background workers (planned)
```

| Path | Description |
|------|-------------|
| [`apps/web/`](apps/web/) | Next.js 16 app — landing, upload flow, Prisma, R2 presigned uploads |
| [`workers/`](workers/) | Reserved for BullMQ / image-processing workers |
| [`docker-compose.yml`](docker-compose.yml) | Local Postgres 16 and Redis 7 |

More product and architecture detail: [`PROJECT_PLAN.md`](PROJECT_PLAN.md), [`apps/web/DESIGN.md`](apps/web/DESIGN.md), [`ROADMAP.md`](ROADMAP.md).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) (for Postgres and Redis)
- Cloudflare R2 credentials (for uploads; optional for UI-only work)

## Quick start

### 1. Start infrastructure

From the repo root:

```bash
docker compose up -d
```

### 2. Configure the web app

```bash
cd apps/web
cp .env.example .env.local
# Edit .env.local — DATABASE_URL, REDIS_URL, R2 keys as needed
```

### 3. Install dependencies and run migrations

```bash
npm install
npm run db:setup   # starts compose (if not running), migrates, generates Prisma client
```

Or step by step:

```bash
npm run db:migrate:deploy
npm run db:generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common commands

**Repo root**

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start Postgres and Redis |
| `docker compose down` | Stop services |
| `docker compose logs -f` | Follow service logs |

**`apps/web/`**

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:setup` | Docker (compose file at repo root) + migrate + Prisma generate |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:generate` | Regenerate Prisma client |

## Environment variables

See [`apps/web/.env.example`](apps/web/.env.example) for the full list. Minimum for local API work:

- `DATABASE_URL` — Postgres (matches `docker-compose.yml` defaults)
- `REDIS_URL` — Redis for BullMQ
- R2 variables — presigned uploads to Cloudflare R2

## License

Private — see repository settings.
