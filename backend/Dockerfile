# -------- Base de execução (leve) --------
FROM node:20-alpine AS base
WORKDIR /app
# Prisma precisa de openssl (presente no alpine, mas garantimos)
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# -------- Dependências --------
FROM base AS deps
# Se você tiver lockfile, copie ele; caso contrário, package.json
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Build (se tiver TypeScript) --------
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
# Se o backend for TS, descomente a linha abaixo e garanta script "build" no package.json
# RUN npm run build

# -------- Runner --------
FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY . .
# Se compilado (TS), copie /dist e ajuste o CMD no entrypoint para usar "node dist/..."
# COPY --from=build /app/dist ./dist

# Entrypoint aplica migração/seed e sobe o servidor
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 5000
CMD ["sh", "/app/entrypoint.sh"]
