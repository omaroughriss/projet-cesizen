FROM node:20-slim

LABEL org.opencontainers.image.source=https://github.com/omaroughriss/projet-cesizen

# Création du répertoire de l'application
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Construction de l'application
ENV NODE_ENV=production
RUN npm run build

# Exposition du port
EXPOSE 4173

# Commande de démarrage
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]