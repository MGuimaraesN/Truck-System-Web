# Use uma imagem base do Node.js leve e oficial
FROM node:20-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os ficheiros de manifesto de pacotes e instale as dependências
# Copiar package-lock.json garante instalações consistentes
COPY package*.json ./

# Instale TODAS as dependências, incluindo as de desenvolvimento como o nodemon,
# que são necessárias para o script "dev"
RUN npm install

# Copie o resto do código da aplicação para o diretório de trabalho
COPY . .

# A porta que a aplicação vai expor.
# O mapeamento real é feito no docker-compose.yml
EXPOSE 5200

# O comando para iniciar a aplicação é definido no docker-compose.yml
# para permitir flexibilidade (ex: usar 'npm run dev' em dev e 'npm start' em prod).
# CMD ["npm", "run", "dev"]
