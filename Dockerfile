FROM node:16-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "/app/dist/apps/elwiz/main.js"]

# docker push 192.168.86.38:5000/elwiz:latest
