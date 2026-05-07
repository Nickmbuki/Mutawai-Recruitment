# Frontend Agent Instructions - Mutawai HR Consultants Limited

## Architecture

The frontend is a React + Vite + TypeScript application for a premium corporate recruitment agency experience. It consumes the backend REST API through Axios and TanStack Query. Routing is handled by React Router. Forms use React Hook Form and Zod validation. Animations use Framer Motion.

## Coding Standards

- TypeScript only.
- Use functional React components and hooks.
- Keep components reusable, typed, and accessible.
- Use TailwindCSS utility classes and local UI primitives in `src/components/ui`.
- Use Lucide icons for icon buttons and visual markers.
- Use Framer Motion for page transitions, hero entrances, scroll reveals, hover states, and counters.
- Do not hard-code API URLs. Read `import.meta.env.VITE_API_URL`.

## Folder Structure Rules

- `src/pages`: route-level pages.
- `src/components`: reusable layout and domain components.
- `src/components/ui`: shadcn-style primitives.
- `src/api`: API request functions.
- `src/lib`: shared helpers, Axios client, validation helpers, constants.
- `src/types`: shared frontend TypeScript types.
- `src/styles` or `src/index.css`: global Tailwind styles.

## Local Development

From the repository root:

```bash
pnpm install
pnpm --filter frontend run dev
```

Set `frontend/.env` or root environment with:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Deployment Rules

- Build with `pnpm --filter frontend run build`.
- Railway frontend service should use the frontend build command and serve `frontend/dist`.
- `VITE_API_URL` must point to the deployed backend `/api` base URL at build time.
- Do not reference localhost in production configuration.

## Railway Deployment Workflow Using YAMA

- YAMA deployment should build the frontend after backend URL variables are configured.
- Verify the frontend service has `VITE_API_URL`.
- Run `pnpm --filter frontend run build` before triggering production deployment.

## Safe Extension Guidance

- Keep route additions in `src/routes.tsx` and add corresponding page components.
- Keep API response types synchronized with backend serializers.
- Preserve corporate visual consistency: restrained color, premium spacing, smooth motion, accessible contrast.
- Avoid adding marketing-only screens when the requested feature is an operational workflow.
- Use loading, error, and empty states for API-backed views.
