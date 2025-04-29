# First stage: build the React app
FROM node:20.18.2-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Second stage: serve the app with nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port (Nginx default is 80)
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
