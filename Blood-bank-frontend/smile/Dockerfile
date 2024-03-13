# Frontend Build 
FROM node:18.19.0 as build
WORKDIR /app

COPY package.json .

RUN npm install --silent

COPY . .

COPY vite.config.js .
RUN npm run build

# Nginx to run frontend
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /var/www/react
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g","daemon off;"]