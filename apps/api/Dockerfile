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
RUN pnpm install -g tsx@^4.21.0

# Install Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium chromium-sandbox ca-certificates fonts-liberation \
    libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 \
    libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 openssl \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils \
    && rm -rf /var/lib/apt/lists/*

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

