# Cullify

AI-first photo culling — upload batches, detect blur and duplicates, group similar shots, and pick the best photos faster.

## Repository layout

```
cullify-app/
├── package.json         # Root scripts (dev, db, etc.)
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

Run everything from the **repo root** unless noted.

### 1. Install web dependencies

```bash
npm run install:web
```

### 2. Configure the web app

```bash
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local — DATABASE_URL, REDIS_URL, R2 keys as needed
```

### 3. Start infrastructure and run migrations

```bash
npm run db:setup
```

Or step by step:

```bash
npm run db:up
npm run db:migrate:deploy
npm run db:generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common commands

**Repo root** (preferred)

| Command | Description |
|---------|-------------|
| `npm run install:web` | Install `apps/web` dependencies |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:up` | Start Postgres and Redis |
| `npm run db:down` | Stop Postgres and Redis |
| `npm run db:logs` | Follow service logs |
| `npm run db:setup` | `db:up` + migrate deploy + Prisma generate |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (deploy) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema without migration |

**`apps/web/`** — same scripts if you `cd` there; `db:setup` also works via compose path to repo root.

## Environment variables

See [`apps/web/.env.example`](apps/web/.env.example) for the full list. Minimum for local API work:

- `DATABASE_URL` — Postgres (matches `docker-compose.yml` defaults)
- `REDIS_URL` — Redis for BullMQ
- R2 variables — presigned uploads to Cloudflare R2

## License

Private — see repository settings.
