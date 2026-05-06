FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY backend/package.json backend/package.json
RUN pnpm install --filter backend... --frozen-lockfile

FROM deps AS build
COPY backend backend
RUN pnpm --filter backend run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json
CMD ["node", "backend/dist/server.js"]
