FROM node:20-alpine AS deps
WORKDIR /app
COPY ../../package.json ./package.json
COPY ../../turbo.json ./turbo.json
COPY ../../apps/api/package.json ./apps/api/package.json
COPY ../../apps/web/package.json ./apps/web/package.json
COPY ../../apps/worker/package.json ./apps/worker/package.json
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY ../../prisma ./prisma
COPY ../../apps ./apps
RUN npx prisma generate
RUN npm run build --workspace api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/dev.db"
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
