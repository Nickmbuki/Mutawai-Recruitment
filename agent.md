# Agent Instructions - Mutawai HR Consultants Limited Recruitment Platform

## Project Architecture

This repository is a full-stack TypeScript monorepo for the Mutawai HR Consultants Limited corporate recruitment platform.

- Root: PNPM workspace orchestration, Turborepo tasks, shared documentation, Railway deployment metadata, and Docker Compose for local PostgreSQL.
- `frontend/`: React + Vite + TypeScript client application using TailwindCSS, Framer Motion, React Router, TanStack Query, React Hook Form, Zod, shadcn-style UI primitives, and Lucide icons.
- `backend/`: Node.js + Express + TypeScript REST API using PostgreSQL, Drizzle ORM, JWT authentication, bcrypt password hashing, Zod validation, and MVC-style modules.

The frontend calls the backend through `VITE_API_URL`. The backend owns all database access and authentication. Do not connect the frontend directly to PostgreSQL.

## Coding Standards

- TypeScript only. Do not add JavaScript source files.
- Keep strict TypeScript enabled and fix type errors instead of weakening compiler settings.
- Prefer small, explicit modules over broad utility files.
- Validate all external input with Zod at API boundaries and form boundaries.
- Keep secrets in environment variables only. Never hard-code credentials, JWT secrets, or production URLs.
- Use consistent formatting through Prettier and lint with ESLint before handoff.
- Preserve the existing folder conventions when extending features.

## Folder Structure Rules

- Root configuration belongs at the monorepo root.
- Frontend UI components belong in `frontend/src/components`.
- Frontend pages belong in `frontend/src/pages`.
- Frontend API clients belong in `frontend/src/lib` or `frontend/src/api`.
- Backend modules belong in `backend/src/modules/<module-name>`.
- Backend shared middleware belongs in `backend/src/middleware`.
- Backend database schema, migration helpers, and seeds belong in `backend/src/db`.
- Do not mix frontend and backend source code.

## Deployment Rules

- Railway deploys the PostgreSQL database, backend service, and frontend service separately.
- Backend production start command must run the compiled server from `backend/dist`.
- Frontend production build must emit static files from `frontend/dist`.
- Environment variables must be configured per Railway service.
- `DATABASE_URL`, `JWT_SECRET`, and `PORT` are backend variables.
- `VITE_API_URL` is a frontend build-time variable.

## Local Development

From the repository root:

```bash
pnpm install
pnpm run dev
```

For PostgreSQL locally:

```bash
docker compose up -d
pnpm --filter backend run db:push
pnpm --filter backend run db:seed
```

Backend runs on port `4000` by default. Frontend runs on Vite's default port unless overridden.

## Railway Deployment Workflow Using YAMA

- Keep Railway deployment configuration in `railway.json`, `nixpacks.toml`, service-specific config, and documented YAMA workflow files.
- Use YAMA as the automation layer for repeatable Railway deployment commands.
- Before deployment, verify:
  - `pnpm run build`
  - backend environment variables are set
  - frontend `VITE_API_URL` points to the deployed backend URL
  - migrations or `db:push` have been applied intentionally
- Do not commit generated secrets or `.env` files.

## Safe Extension Guidance For Future AI Agents

- Read this file plus the scoped `frontend/agent.md` or `backend/agent.md` before editing.
- Make focused changes and avoid broad rewrites unless the user explicitly asks.
- Add or update validation, API types, and tests when changing behavior.
- Keep role-based authorization explicit for admin, employer, and candidate workflows.
- When adding database fields, update Drizzle schema, migration workflow, seed data, API serializers, and frontend consumers together.
- Document new environment variables in `.env.example` and deployment docs.
