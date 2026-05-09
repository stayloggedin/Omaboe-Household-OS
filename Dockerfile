# Railway often sets NODE_ENV=production during `docker build`. That makes
# `npm install` skip devDependencies, and `next build` then fails (no TypeScript,
# Tailwind, postcss, eslint-config-next, etc.).

FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build \
  && npm prune --omit=dev

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "exec npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
