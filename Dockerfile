# Railway often sets NODE_ENV=production during `docker build`, which skips
# devDependencies and breaks `next build`. Force development until after build.

# Use AWS Public ECR mirror of official Node image (avoids Docker Hub rate limits on CI).
FROM public.ecr.aws/docker/library/node:20-bookworm-slim

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
RUN npm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "exec npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
