# Alterado de "node:20-alpine" para a versão do ECR Public
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Copia os ficheiros de manifesto PRIMEIRO para otimizar o cache
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta que a nossa API vai usar (definida no .env)
EXPOSE 5200

# Comando para correr a aplicação em modo de desenvolvimento com hot-reload
CMD [ "npm", "run", "dev" ]
