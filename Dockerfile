# Single-stage image: avoids standalone COPY issues on some hosts.
# Railway sets PORT at runtime; Next must bind 0.0.0.0.

FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# shell form so Railway's PORT is expanded at container start
CMD ["sh", "-c", "exec npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
