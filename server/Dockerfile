FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
