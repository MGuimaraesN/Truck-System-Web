#!/bin/sh
set -e

echo "➡️  DATABASE_URL=$DATABASE_URL"
echo "➡️  Aplicando migrations..."
npx prisma migrate deploy

echo "➡️  Gerando Prisma Client..."
npx prisma generate

if [ "$SEED" = "true" ]; then
  echo "➡️  Rodando seed..."
  # Ajuste este comando para o seu seed real
  npm run seed || true
fi

echo "✅  Backend pronto. Subindo servidor..."
# Se for TypeScript compilado: node dist/server.js
# Caso seja JS direto:
npm run start || node server.js
