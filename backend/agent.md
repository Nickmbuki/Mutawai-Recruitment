# Backend Agent Instructions - Mutawai Consultants Limited

## Architecture

The backend is a Node.js + Express + TypeScript REST API. It uses PostgreSQL through Drizzle ORM, JWT access tokens for authentication, bcrypt for password hashing, Zod for request validation, and MVC-style domain modules.

Core modules:

- `auth`
- `users`
- `jobs`
- `applications`
- `companies`
- `admin`

## Coding Standards

- TypeScript only.
- Keep strict typing enabled.
- Validate request bodies and params with Zod.
- Hash passwords with bcrypt before storage.
- Never return `password_hash` in API responses.
- Use middleware for authentication and role authorization.
- Keep controllers thin, services focused on business logic, and repositories/database calls explicit.
- Return consistent JSON envelopes for errors.

## Folder Structure Rules

- `src/app.ts`: Express app setup.
- `src/server.ts`: server bootstrap.
- `src/config`: environment parsing and app configuration.
- `src/db`: Drizzle client, schema, migrations, seed data.
- `src/middleware`: shared Express middleware.
- `src/modules/<module>`: routes, controllers, services, validators, and module-specific helpers.
- `src/utils`: shared utilities such as async handlers and errors.

## Local Development

From the repository root:

```bash
pnpm install
docker compose up -d
pnpm --filter backend run db:push
pnpm --filter backend run db:seed
pnpm --filter backend run dev
```

Required backend environment:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mutawai_recruitment
JWT_SECRET=replace-with-a-secure-secret
PORT=4000
```

## Deployment Rules

- Build with `pnpm --filter backend run build`.
- Start production with `pnpm --filter backend run start`.
- Railway backend service requires `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
- Apply schema changes intentionally before routing production traffic.
- Never run seed data against production unless explicitly intended.

## Railway Deployment Workflow Using YAMA

- YAMA should provision or link Railway PostgreSQL first.
- Then deploy backend with the Railway-provided `DATABASE_URL`.
- Set `JWT_SECRET` as a strong Railway secret.
- Confirm `/health` responds before wiring the frontend service to the backend URL.

## Safe Extension Guidance

- When adding endpoints, add route, validator, controller, service, authorization, and documentation together.
- When adding database fields, update Drizzle schema, generated migrations or migration workflow, seed data, and API serializers.
- Keep authorization role checks close to route definitions.
- Prefer explicit SQL conditions through Drizzle over filtering sensitive records in memory.
- Do not expose admin routes without `requireRole("admin")`.
