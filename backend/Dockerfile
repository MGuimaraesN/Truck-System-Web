# ./backend/Dockerfile

# PASSO 1: Usar a imagem base Debian 11 (bullseye), que usa OpenSSL 1.1.x
FROM public.ecr.aws/docker/library/node:18-bullseye-slim

# Instala dependências essenciais (incluindo o cliente sqlite3)
RUN apt-get update && apt-get install -y openssl sqlite3

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o schema do Prisma primeiro
COPY prisma ./prisma/

# Gera o Prisma Client (agora usando o OpenSSL 1.1.x da imagem)
RUN npx prisma generate

# Copia o restante do código-fonte do backend
COPY . .

# Expõe a porta que o servidor Node vai usar
EXPOSE 5000

# Comando para rodar as migrações E iniciar o servidor
# Isso garante que o banco de dados esteja pronto antes do app iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
