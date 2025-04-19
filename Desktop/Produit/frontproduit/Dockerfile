# Étape 1 : Build de l'app Angular
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Étape 2 : Serveur Nginx pour servir les fichiers Angular compilés
FROM nginx:alpine

# Copier les fichiers build Angular
COPY --from=builder /app/dist/frontproduit /usr/share/nginx/html

# Copier la configuration personnalisée de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
