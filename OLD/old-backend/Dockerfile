# Utiliser l'image officielle de Node.js avec une version LTS pour stabilité
FROM node:16-alpine

# Installer les dépendances de build nécessaires pour bcrypt
RUN apk add --no-cache make gcc g++ python3

# Définir un répertoire de travail pour l'application
WORKDIR /app

# Copier uniquement package.json et package-lock.json pour optimiser le cache Docker lors de l'installation des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste de l'application
COPY . .

# Exposer le port utilisé par votre application Express
EXPOSE 3000

# Lancer l'application via src/index.js
CMD ["node", "src/index.js"]
