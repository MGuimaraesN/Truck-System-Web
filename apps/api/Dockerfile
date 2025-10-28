# apps/api/Dockerfile

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./package.json
COPY turbo.json ./turbo.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/worker/package.json ./apps/worker/package.json
RUN npm install

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY prisma ./prisma
COPY apps ./apps
RUN npx prisma generate
RUN npm run build --workspace api

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/dev.db"
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist # <-- Caminho correto para o build da API
COPY --from=build /app/prisma ./prisma     # <-- Caminho correto para o prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]