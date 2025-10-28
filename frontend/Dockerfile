# -------- Build do Vite --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}
COPY . .
RUN npm run build

# -------- Nginx para servir estático + proxy /api --------
FROM nginx:alpine
# Substitui a config padrão com o nosso reverse proxy
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copia a saída do Vite
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
