FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY frontend/package.json frontend/package.json
RUN pnpm install --filter frontend... --frozen-lockfile

FROM deps AS build
COPY frontend frontend
RUN pnpm --filter frontend run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/frontend/dist ./frontend/dist
COPY --from=build /app/frontend/package.json ./frontend/package.json
CMD ["pnpm", "--filter", "frontend", "run", "preview", "--", "--host", "0.0.0.0"]
