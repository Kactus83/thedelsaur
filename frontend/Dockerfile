# Étape de build
FROM node:18-alpine AS build
WORKDIR /app
# Ajout d'un argument de build pour REACT_APP_API_URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# On copie uniquement les fichiers package pour profiter du cache npm
COPY package*.json ./
RUN npm install
# On copie le reste du code
COPY . .
# Construction de l'application en mode production
RUN npm run build

# Étape de production avec Nginx
FROM nginx:stable-alpine
# On remplace la conf par défaut
COPY nginx.conf /etc/nginx/conf.d/default.conf
# On copie le build de l'application vers le dossier public de Nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
