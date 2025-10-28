FROM node:20-alpine AS build
WORKDIR /app
COPY ../../package.json ./package.json
COPY ../../turbo.json ./turbo.json
COPY ../../apps/api/package.json ./apps/api/package.json
COPY ../../apps/web/package.json ./apps/web/package.json
COPY ../../apps/worker/package.json ./apps/worker/package.json
RUN npm install
COPY ../../apps ./apps
RUN npm run build --workspace web

FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
