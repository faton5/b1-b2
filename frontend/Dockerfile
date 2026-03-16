FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
    && pnpm install --frozen-lockfile

FROM base AS builder

ENV DATABASE_URL=:memory:

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable \
    && pnpm build

FROM base AS runner

ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL=file:/app/data/app.db

COPY package.json pnpm-lock.yaml next.config.mjs ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN mkdir -p /app/data

RUN corepack enable

EXPOSE 3000

CMD ["pnpm", "start"]
