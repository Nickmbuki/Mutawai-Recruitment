# Local Setup

## Prerequisites

- Node.js 22
- PNPM 9+
- Docker Desktop
- PostgreSQL client tools are optional

## Install Dependencies

```bash
pnpm install
```

## Environment Variables

Create a local `.env` from `.env.example`.

```bash
cp .env.example .env
```

Backend:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mutawai_recruitment
JWT_SECRET=replace-with-a-long-random-production-secret
PORT=4000
```

Frontend:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Start PostgreSQL

```bash
docker compose up -d
```

## Database Schema And Seed Data

```bash
pnpm --filter backend run db:push
pnpm --filter backend run db:seed
```

The Drizzle schema is in `backend/src/db/schema.ts`. The initial SQL migration is in
`backend/drizzle/0000_initial.sql`.

## Run Locally

```bash
pnpm run dev
```

Run services individually:

```bash
pnpm --filter backend run dev
pnpm --filter frontend run dev
```

## Quality Checks

```bash
pnpm run lint
pnpm run build
```
