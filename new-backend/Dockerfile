# Étape 1 : Build Stage
FROM node:16-alpine AS builder

# Installer les dépendances de build nécessaires pour les modules natifs comme bcrypt
RUN apk add --no-cache make gcc g++ python3

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json tsconfig.json ./

# Installer toutes les dépendances (y compris les devDependencies)
RUN npm install

# Copier le reste de l'application
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Étape 2 : Production Stage
FROM node:16-alpine

# Installer les dépendances nécessaires pour exécuter les modules natifs
RUN apk add --no-cache make gcc g++ python3

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Copier le code compilé depuis le builder
COPY --from=builder /app/dist ./dist

# Exposer le port utilisé par votre application
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/index.js"]
