FROM node:20-alpine

# Installer les dépendances nécessaires pour compiler bcrypt
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances avec compilation native
RUN npm install bcrypt --build-from-source && npm install

# Copier le reste de l'application
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
