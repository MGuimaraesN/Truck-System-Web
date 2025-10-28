# apps/web/Dockerfile

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./package.json            # <--- Verifique
COPY turbo.json ./turbo.json                # <--- Verifique
COPY apps/api/package.json ./apps/api/package.json       # <--- Verifique
COPY apps/web/package.json ./apps/web/package.json       # <--- Verifique
COPY apps/worker/package.json ./apps/worker/package.json # <--- Verifique
RUN npm install
COPY apps ./apps                             # <--- Verifique
RUN npm run build --workspace web

FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html # <-- Caminho correto para o build da web
EXPOSE 80