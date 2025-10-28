# apps/worker/Dockerfile

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./package.json            # <--- Verifique
COPY turbo.json ./turbo.json                # <--- Verifique
COPY apps/api/package.json ./apps/api/package.json       # <--- Verifique
COPY apps/web/package.json ./apps/web/package.json       # <--- Verifique
COPY apps/worker/package.json ./apps/worker/package.json # <--- Verifique
RUN npm install
COPY apps ./apps                             # <--- Verifique
COPY prisma ./prisma                         # <--- Verifique
RUN npm run build --workspace worker

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/dev.db"
ENV API_URL=http://api:3000/api
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/worker/dist ./dist # <-- Caminho correto para o build do worker
COPY --from=build /app/prisma ./prisma     # <-- Caminho correto para o prisma
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]