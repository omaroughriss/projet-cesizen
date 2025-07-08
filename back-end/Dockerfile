# 1) Dépendances
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2) Build
FROM deps AS builder
WORKDIR /app

# Copier Prisma et générer le client (types disponibles pour le build)
COPY prisma ./prisma
RUN npx prisma generate

# Copier le code et config TS
COPY tsconfig*.json ./
COPY src ./src

# Compiler NestJS
RUN npm run build \
    && echo "---- Contenu de /app/dist ----" \
    && ls -R /app/dist

# 3) Image finale
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copier uniquement ce qui est nécessaire
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copier et configurer le script d'initialisation
COPY init.sh ./
RUN chmod +x init.sh

EXPOSE 3000
CMD ["./init.sh"]
