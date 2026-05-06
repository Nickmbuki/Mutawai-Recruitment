# Railway Deployment

This platform is designed for three Railway services:

- Railway PostgreSQL
- Backend API service
- Frontend web service

## Required Environment Variables

Backend service:

```bash
DATABASE_URL=
JWT_SECRET=
PORT=
```

Frontend service:

```bash
VITE_API_URL=https://your-backend-service.up.railway.app/api
```

## YAMA Workflow

YAMA deployment metadata lives in `.yama/railway.yaml`.

Recommended workflow:

```bash
pnpm install
pnpm run build
pnpm run deploy
```

YAMA should:

1. Provision or link Railway PostgreSQL.
2. Inject Railway `DATABASE_URL` into the backend service.
3. Set a strong `JWT_SECRET` in Railway.
4. Deploy the backend and verify `/health`.
5. Set frontend `VITE_API_URL` to the backend `/api` URL.
6. Build and deploy the frontend service.

## Railway Build Commands

Backend:

```bash
pnpm install --frozen-lockfile
pnpm --filter backend run build
pnpm --filter backend run start
```

Frontend:

```bash
pnpm install --frozen-lockfile
pnpm --filter frontend run build
pnpm --filter frontend run preview -- --host 0.0.0.0 --port $PORT
```

## Database Changes

For schema updates, review Drizzle changes before production deployment:

```bash
pnpm --filter backend run db:generate
pnpm --filter backend run db:push
```

Do not run `db:seed` against production unless intentionally reseeding production data.
