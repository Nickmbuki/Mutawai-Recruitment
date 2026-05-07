# Mutawai HR Consultants Limited Recruitment Platform

Production-grade full-stack recruitment platform for Mutawai HR Consultants Limited.

## Stack

- Monorepo: PNPM workspaces + Turborepo
- Frontend: React, Vite, TypeScript, TailwindCSS, Framer Motion, React Router, TanStack Query, React Hook Form, Zod, Axios, Lucide icons
- Backend: Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, JWT, bcrypt, Zod
- Deployment: Railway PostgreSQL, backend service, frontend service, YAMA workflow metadata

## Quick Start

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm --filter backend run db:push
pnpm --filter backend run db:seed
pnpm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000`

Health check: `http://localhost:4000/health`

## Demo Accounts

After seeding, all demo accounts use:

```text
MutawaiSecure123!
```

- `admin@mutawai.co.ke`
- `employer@mutawai.co.ke`
- `candidate@mutawai.co.ke`

## Project Layout

```text
recruitment-platform/
  agent.md
  package.json
  docker-compose.yml
  railway.json
  nixpacks.toml
  .yama/railway.yaml
  frontend/
    agent.md
    src/
  backend/
    agent.md
    src/
    drizzle/
```

Read `agent.md`, `frontend/agent.md`, and `backend/agent.md` before extending the system.
