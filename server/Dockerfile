FROM node:20-alpine

# Installer les outils nécessaires pour compiler les modules natifs
RUN apk add --no-cache python3 make g++ && \
    npm install -g npm@latest

WORKDIR /app

# Copier les fichiers package.json pour éviter de copier node_modules de l'hôte
COPY package*.json ./

# Installer les dépendances dont bcrypt avec rebuild natif
RUN npm install && npm rebuild bcrypt --build-from-source

# Copier le reste du code
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
