FROM node:18.19.0 as build
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY vite.config.js .
RUN npm run build

# EXPOSE 8080
# CMD ["npm", "run", "preview" ]

# For 