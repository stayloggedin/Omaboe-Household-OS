# Railway may set NODE_ENV=production during install; that skips devDependencies.
# Use `npm install --include=dev` so TypeScript/Tailwind/etc. are present.
#
# Do NOT set NODE_ENV=development during `next build` - Next must use production
# bundles or prerender (/404, /500, /) fails with Html/useContext errors.

FROM public.ecr.aws/docker/library/node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json ./
RUN npm install --no-audit --no-fund --include=dev

COPY . .

# Optional: Railway passes service variables as build-args so NEXT_PUBLIC_* can embed at build.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_HOUSEHOLD_NAME
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_HOUSEHOLD_NAME=$NEXT_PUBLIC_HOUSEHOLD_NAME

ENV NODE_ENV=production
RUN npm run build

ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["sh", "-c", "exec npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
