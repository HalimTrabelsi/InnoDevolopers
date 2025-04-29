FROM node:20.18.4 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:alpine

# Copy the build files from the previous stage to the nginx web server
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app will run on
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
