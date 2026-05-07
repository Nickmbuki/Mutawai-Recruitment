# Architecture

## Overview

Mutawai HR Consultants Limited Recruitment Platform is a TypeScript monorepo with a React frontend and
Express backend. The backend owns authentication, authorization, database access, and REST API
contracts. The frontend consumes the API through Axios and TanStack Query.

## Frontend

The frontend is in `frontend/`.

- `src/pages`: route-level screens
- `src/components/layout`: navigation, footer, transitions
- `src/components/ui`: shadcn-style primitives
- `src/components/jobs`: job-specific components
- `src/components/cards`: reusable employer and candidate cards
- `src/components/sections`: CTA, reveal, counters, testimonials
- `src/api`: API functions
- `src/lib`: shared utilities and Axios client
- `src/types`: API-facing TypeScript types

Frontend routing:

- `/`
- `/about`
- `/services`
- `/jobs`
- `/jobs/:id`
- `/candidates`
- `/contact`
- `/login`
- `/admin`

## Backend

The backend is in `backend/`.

- `src/app.ts`: Express app and route mounting
- `src/server.ts`: server bootstrap
- `src/config`: environment validation
- `src/db`: Drizzle client, schema, and seed data
- `src/middleware`: auth and error handling
- `src/modules`: MVC-style domain modules
- `src/utils`: shared helpers

Backend modules:

- `auth`: register, login, current user
- `users`: user retrieval helper layer
- `jobs`: public listing plus protected employer/admin management
- `applications`: protected candidate application workflow
- `companies`: single-company profile support for Mutawai HR Consultants Limited
- `admin`: admin-only user and job oversight

## Database

Tables:

- `users`
- `companies`
- `jobs`
- `applications`

Roles:

- `admin`
- `employer`
- `candidate`

Application statuses:

- `submitted`
- `reviewing`
- `shortlisted`
- `rejected`
- `hired`

## Security Model

- Passwords are hashed with bcrypt.
- JWT access tokens carry user ID, email, and role.
- Protected routes use `requireAuth`.
- Role-gated routes use `requireRole`.
- Admin routes require `admin`.
- Job management requires the admin role.
- Candidate application routes require `candidate`.

## Extension Rules

When adding new capabilities:

- Add backend validation with Zod.
- Keep route authorization explicit.
- Update frontend API types.
- Add loading, error, and empty states for API-backed screens.
- Document new environment variables and deployment changes.
