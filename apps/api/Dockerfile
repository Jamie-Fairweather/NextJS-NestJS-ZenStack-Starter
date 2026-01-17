ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS prepare

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN pnpm install -g turbo
COPY . .
RUN turbo prune api --docker

# ---
FROM node:${NODE_VERSION}-slim AS build

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install -g turbo

WORKDIR /app

# Install dependencies
COPY --from=prepare /app/out/json/ .
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source and build
COPY --from=prepare /app/out/full/ .
RUN pnpm --filter @workspace/database generate
ARG DATABASE_URL
RUN if [ -n "$DATABASE_URL" ]; then pnpm --filter @workspace/database migrate deploy; fi
RUN turbo build --filter=api

# ---
FROM node:${NODE_VERSION}-slim AS runtime

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install -g tsx@latest

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m -d /home/nodejs -s /bin/false nodejs

WORKDIR /app

COPY --from=build --chown=nodejs:nodejs /app ./

USER nodejs
ENV NODE_ENV=production \
    PORT=4000 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 4000

CMD ["tsx", "--tsconfig", "apps/api/tsconfig.runtime.json", "apps/api/dist/apps/api/src/main.js"]

