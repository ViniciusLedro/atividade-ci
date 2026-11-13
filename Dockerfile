FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

COPY server.js ./

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]