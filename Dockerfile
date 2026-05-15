# ==========================================
# ESTÁGIO 1: DESENVOLVIMENTO
# ==========================================
# Estágio de Desenvolvimento
FROM node:20-alpine AS development

# Cria o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Expõe a porta da API
EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ==========================================
# ESTÁGIO 2: BUILD (Compilando o código)
# ==========================================
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências de novo para poder buildar
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# ==========================================
# ESTÁGIO 3: PRODUÇÃO (O que roda no Render)
# ==========================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Instala APENAS as dependências de produção (deixa a imagem mais leve)
RUN npm install --only=production
RUN npx prisma generate

# Copia apenas a pasta "dist" (código compilado) do estágio de BUILD
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Comando para o Render (código otimizado)
CMD ["npm", "run", "start:prod"]